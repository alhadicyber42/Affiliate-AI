require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const productScraper = require('./services/productScraper');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Deepseek Client (via OpenAI SDK)
const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com'
});

// Root Route
app.get('/', (req, res) => {
    res.send('Affiliator AI Backend is Running');
});

// Supabase Connection Test
app.get('/api/test-supabase', async (req, res) => {
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1); // Assuming 'profiles' table exists, or just check generic connection
        if (error) throw error;
        res.json({ success: true, message: 'Supabase connected successfully', data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Supabase connection failed', error: error.message });
    }
});

// Deepseek Chat Endpoint
app.post('/api/generate-content', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    try {
        const completion = await deepseek.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
        });

        res.json({ success: true, data: completion.choices[0].message.content });
    } catch (error) {
        console.error('Deepseek API Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate content', error: error.message });
    }
});

// Product Extraction Endpoint
app.post('/api/extract-product', async (req, res) => {
    const { url, userId } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        console.log('🔍 Extracting product from:', url);

        // Check user credits
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const EXTRACT_COST = 10; // 10 credits per extraction
        if (profile.credits < EXTRACT_COST) {
            return res.status(402).json({ 
                success: false, 
                message: 'Insufficient credits',
                required: EXTRACT_COST,
                available: profile.credits
            });
        }

        let platform = 'unknown';
        if (url.includes('shopee')) platform = 'shopee';
        else if (url.includes('tokopedia')) platform = 'tokopedia';
        else if (url.includes('tiktok')) platform = 'tiktok';
        else if (url.includes('lazada')) platform = 'lazada';

        console.log('🕷️  Scraping product data with Puppeteer...');
        
        // Scrape product data with Puppeteer
        let scrapedData;
        try {
            scrapedData = await productScraper.scrapeProduct(url);
            console.log('✅ Scraping successful:', scrapedData.name);
        } catch (scrapeError) {
            console.warn('⚠️  Scraping failed, falling back to AI:', scrapeError.message);
            scrapedData = null;
        }

        // Use AI to enhance/analyze the scraped data
        const prompt = scrapedData 
            ? `Analyze this product data and enhance it with marketing insights:
            
Product Data:
- Name: ${scrapedData.name}
- Price: Rp ${scrapedData.price}
- Rating: ${scrapedData.rating}
- Sold: ${scrapedData.soldCount}
- Platform: ${platform}

Provide enhanced data in STRICT JSON format:
{
    "category": "Product Category",
    "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
    "viralScore": 8.5,
    "usp": ["Unique Selling Point 1", "Unique Selling Point 2"],
    "contentAngles": ["Review", "Unboxing", "Comparison"],
    "description": "Catchy marketing description"
}`
            : `Act as an expert affiliate marketer. I will give you a product URL from ${platform}. 
URL: ${url}

Analyze this URL and provide detailed product information in STRICT JSON format.
Provide a professional sample extraction based on the URL context.

JSON Structure:
{
    "name": "Product Name",
    "description": "Short catchy description",
    "price": 100000,
    "originalPrice": 150000,
    "discount": 33,
    "rating": 4.8,
    "soldCount": "1.2k",
    "images": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
    "platform": "${platform}",
    "category": "Category",
    "keyFeatures": ["Feature 1", "Feature 2"],
    "viralScore": 8.5,
    "usp": ["Unique Selling Point 1", "Unique Selling Point 2"],
    "contentAngles": ["Review", "Unboxing", "Comparison"]
}`;

        const completion = await deepseek.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            response_format: { type: 'json_object' }
        });

        const aiData = JSON.parse(completion.choices[0].message.content);

        // Merge scraped data with AI enhancements
        const finalData = scrapedData ? {
            name: scrapedData.name,
            description: aiData.description || scrapedData.description,
            price: scrapedData.price,
            original_price: scrapedData.originalPrice,
            discount: scrapedData.discount,
            rating: scrapedData.rating,
            sold_count: scrapedData.soldCount,
            images: scrapedData.images,
            platform: scrapedData.platform,
            product_url: url,
            category: aiData.category,
            key_features: aiData.keyFeatures,
            viral_score: aiData.viralScore,
            usp: aiData.usp,
            content_angles: aiData.contentAngles,
        } : {
            name: aiData.name,
            description: aiData.description,
            price: aiData.price,
            original_price: aiData.originalPrice,
            discount: aiData.discount,
            rating: aiData.rating,
            sold_count: aiData.soldCount,
            images: aiData.images,
            platform: aiData.platform,
            product_url: url,
            category: aiData.category,
            key_features: aiData.keyFeatures,
            viral_score: aiData.viralScore,
            usp: aiData.usp,
            content_angles: aiData.contentAngles,
        };

        // Save to Supabase
        const { data: product, error: dbError } = await supabase
            .from('products')
            .insert({
                user_id: userId,
                ...finalData
            })
            .select()
            .single();

        if (dbError) throw dbError;

        // Deduct credits
        const { error: creditError } = await supabase
            .from('profiles')
            .update({ credits: profile.credits - EXTRACT_COST })
            .eq('id', userId);

        if (creditError) throw creditError;

        console.log('✅ Product saved to database');

        res.json({ 
            success: true, 
            data: product,
            creditsUsed: EXTRACT_COST,
            creditsRemaining: profile.credits - EXTRACT_COST,
            scrapingMethod: scrapedData ? 'puppeteer' : 'ai-fallback'
        });
    } catch (error) {
        console.error('Extraction Error:', error);
        res.status(500).json({ success: false, message: 'Failed to extract product', error: error.message });
    }
});

// Get User Products
app.get('/api/products/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get products', error: error.message });
    }
});

// Delete Product
app.delete('/api/products/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;

        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
    }
});

// Generate Script Endpoint
app.post('/api/generate-script', async (req, res) => {
    const { userId, productId, framework, platform, tone } = req.body;

    if (!userId || !productId || !framework || !platform || !tone) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Check user credits
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const SCRIPT_COST = 20; // 20 credits per script
        if (profile.credits < SCRIPT_COST) {
            return res.status(402).json({ 
                success: false, 
                message: 'Insufficient credits',
                required: SCRIPT_COST,
                available: profile.credits
            });
        }

        // Get product details
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (productError) throw productError;

        const prompt = `Generate a viral short-form video script for an affiliate product.

Product Details:
- Name: ${product.name}
- Description: ${product.description}
- Price: Rp ${product.price}
- Platform: ${product.platform}
- Category: ${product.category}
- USP: ${product.usp?.join(', ')}

Script Requirements:
- Framework: ${framework}
- Platform: ${platform}
- Tone: ${tone}
- Duration: 30-60 seconds
- Must be engaging and conversion-focused

Return ONLY a JSON object with this EXACT structure:
{
  "title": "Catchy script title",
  "modules": [
    { "type": "hook", "content": "Viral hook that grabs attention in 3 seconds", "duration": "00:05" },
    { "type": "problem", "content": "The problem this product solves", "duration": "00:10" },
    { "type": "solution", "content": "How the product solves it", "duration": "00:15" },
    { "type": "cta", "content": "Strong call to action", "duration": "00:05" }
  ]
}`;

        const completion = await deepseek.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            response_format: { type: 'json_object' }
        });

        const aiScript = JSON.parse(completion.choices[0].message.content);

        // Calculate total duration
        const totalSeconds = aiScript.modules.reduce((sum, m) => {
            const [min, sec] = m.duration.split(':').map(Number);
            return sum + (min * 60) + sec;
        }, 0);
        const totalDuration = `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`;

        // Save script to database
        const { data: script, error: scriptError } = await supabase
            .from('scripts')
            .insert({
                user_id: userId,
                product_id: productId,
                title: aiScript.title,
                framework,
                platform,
                tone,
                total_duration: totalDuration,
                score: Math.floor(Math.random() * 20) + 80, // Random score 80-100
            })
            .select()
            .single();

        if (scriptError) throw scriptError;

        // Save script modules
        const modulesData = aiScript.modules.map((module, index) => ({
            script_id: script.id,
            type: module.type,
            content: module.content,
            duration: module.duration,
            order_index: index,
        }));

        const { data: modules, error: modulesError } = await supabase
            .from('script_modules')
            .insert(modulesData)
            .select();

        if (modulesError) throw modulesError;

        // Deduct credits
        const { error: creditError } = await supabase
            .from('profiles')
            .update({ credits: profile.credits - SCRIPT_COST })
            .eq('id', userId);

        if (creditError) throw creditError;

        // Return complete script with modules
        const completeScript = {
            ...script,
            modules: modules.sort((a, b) => a.order_index - b.order_index),
        };

        res.json({ 
            success: true, 
            data: completeScript,
            creditsUsed: SCRIPT_COST,
            creditsRemaining: profile.credits - SCRIPT_COST
        });
    } catch (error) {
        console.error('Generate Script Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate script', error: error.message });
    }
});

// Get User Scripts
app.get('/api/scripts/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: scripts, error: scriptsError } = await supabase
            .from('scripts')
            .select('*, script_modules(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (scriptsError) throw scriptsError;

        // Format scripts with sorted modules
        const formattedScripts = scripts.map(script => ({
            ...script,
            modules: script.script_modules.sort((a, b) => a.order_index - b.order_index),
        }));

        res.json({ success: true, data: formattedScripts });
    } catch (error) {
        console.error('Get Scripts Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get scripts', error: error.message });
    }
});

// Delete Script
app.delete('/api/scripts/:scriptId', async (req, res) => {
    const { scriptId } = req.params;

    try {
        const { error } = await supabase
            .from('scripts')
            .delete()
            .eq('id', scriptId);

        if (error) throw error;

        res.json({ success: true, message: 'Script deleted' });
    } catch (error) {
        console.error('Delete Script Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete script', error: error.message });
    }
});

// Regenerate Script Module
app.post('/api/regenerate-module', async (req, res) => {
    const { moduleId, scriptId } = req.body;

    if (!moduleId || !scriptId) {
        return res.status(400).json({ success: false, message: 'Module ID and Script ID required' });
    }

    try {
        // Get current module
        const { data: module, error: moduleError } = await supabase
            .from('script_modules')
            .select('*')
            .eq('id', moduleId)
            .single();

        if (moduleError) throw moduleError;

        // Get script details
        const { data: script, error: scriptError } = await supabase
            .from('scripts')
            .select('*, products(*)')
            .eq('id', scriptId)
            .single();

        if (scriptError) throw scriptError;

        const prompt = `Regenerate a ${module.type} module for this affiliate product script.

Product: ${script.products?.name}
Framework: ${script.framework}
Platform: ${script.platform}
Tone: ${script.tone}
Module Type: ${module.type}
Current Content: ${module.content}

Generate a NEW, DIFFERENT version that is more engaging and conversion-focused.
Return ONLY the new content text, no JSON, no formatting.`;

        const completion = await deepseek.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
        });

        const newContent = completion.choices[0].message.content.trim();

        // Update module
        const { data: updatedModule, error: updateError } = await supabase
            .from('script_modules')
            .update({ content: newContent })
            .eq('id', moduleId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({ success: true, data: updatedModule });
    } catch (error) {
        console.error('Regenerate Module Error:', error);
        res.status(500).json({ success: false, message: 'Failed to regenerate module', error: error.message });
    }
});

// Generate Video Endpoint
app.post('/api/generate-video', async (req, res) => {
    const { userId, scriptId, style } = req.body;

    if (!userId || !scriptId || !style) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Check user credits
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const VIDEO_COST = 50; // 50 credits per video
        if (profile.credits < VIDEO_COST) {
            return res.status(402).json({ 
                success: false, 
                message: 'Insufficient credits',
                required: VIDEO_COST,
                available: profile.credits
            });
        }

        // Get script details
        const { data: script, error: scriptError } = await supabase
            .from('scripts')
            .select('*, script_modules(*)')
            .eq('id', scriptId)
            .single();

        if (scriptError) throw scriptError;

        // Create video record with processing status
        const { data: video, error: videoError } = await supabase
            .from('videos')
            .insert({
                user_id: userId,
                script_id: scriptId,
                title: `Video: ${script.title}`,
                style,
                status: 'processing',
                duration: script.total_duration,
                resolution: '1080p',
                thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
            })
            .select()
            .single();

        if (videoError) throw videoError;

        // Deduct credits
        const { error: creditError } = await supabase
            .from('profiles')
            .update({ credits: profile.credits - VIDEO_COST })
            .eq('id', userId);

        if (creditError) throw creditError;

        // Simulate video generation (in production, this would trigger actual video generation)
        // For now, we'll mark it as completed after a delay
        setTimeout(async () => {
            await supabase
                .from('videos')
                .update({ 
                    status: 'completed',
                    video_url: `https://example.com/videos/${video.id}.mp4`
                })
                .eq('id', video.id);
        }, 5000);

        res.json({ 
            success: true, 
            data: video,
            creditsUsed: VIDEO_COST,
            creditsRemaining: profile.credits - VIDEO_COST
        });
    } catch (error) {
        console.error('Generate Video Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate video', error: error.message });
    }
});

// Get User Videos
app.get('/api/videos/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: videos, error } = await supabase
            .from('videos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data: videos });
    } catch (error) {
        console.error('Get Videos Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get videos', error: error.message });
    }
});

// Delete Video
app.delete('/api/videos/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', videoId);

        if (error) throw error;

        res.json({ success: true, message: 'Video deleted' });
    } catch (error) {
        console.error('Delete Video Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete video', error: error.message });
    }
});

// Get User Profile (with credits)
app.get('/api/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        res.json({ success: true, data: profile });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get profile', error: error.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Cleanup on exit
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await productScraper.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await productScraper.close();
    process.exit(0);
});
