require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

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

        let platform = 'unknown';
        if (url.includes('shopee')) platform = 'shopee';
        else if (url.includes('tokopedia')) platform = 'tokopedia';
        else if (url.includes('tiktok')) platform = 'tiktok';
        else if (url.includes('lazada')) platform = 'lazada';

        const prompt = `Act as an expert affiliate marketer. I will give you a product URL from ${platform}. 
        URL: ${url}
        
        Analyze this URL and provide detailed product information in STRICT JSON format.
        If you don't know the exact product, provide a highly professional 'sample' extraction based on the URL context.
        
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

        // Save to Supabase
        const { data: product, error: dbError } = await supabase
            .from('products')
            .insert({
                user_id: userId,
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
            })
            .select()
            .single();

        if (dbError) throw dbError;

        res.json({ success: true, data: product });
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

        // Return complete script with modules
        const completeScript = {
            ...script,
            modules: modules.sort((a, b) => a.order_index - b.order_index),
        };

        res.json({ success: true, data: completeScript });
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

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
