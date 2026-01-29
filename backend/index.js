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
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required' });
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

        const productData = JSON.parse(completion.choices[0].message.content);
        productData.id = Math.random().toString(36).substr(2, 9);
        productData.productUrl = url;
        productData.extractedAt = new Date().toISOString();

        res.json({ success: true, data: productData });
    } catch (error) {
        console.error('Extraction Error:', error);
        res.status(500).json({ success: false, message: 'Failed to extract product', error: error.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
