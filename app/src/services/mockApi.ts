import axios from 'axios';
import { supabase } from '@/lib/supabase';
import type {
  User,
  Script,
  ScriptModule,
  Video,
  TrendingItem,
  ABTest,
  MarketplaceBrand,
  Template
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || data.user.email!.split('@')[0],
      avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
      plan: profile?.plan || 'free',
      credits: profile?.credits || 100,
      createdAt: profile?.created_at || new Date().toISOString(),
    };
  },

  async register(email: string, password: string, name: string): Promise<User> {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name,
        email,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        plan: 'free',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      plan: 'free',
      credits: 100,
      createdAt: new Date().toISOString(),
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser(): User | null {
    // This will be called on mount, but we'll handle it differently
    // in AuthContext using supabase.auth.getSession()
    return null;
  },

  updateUser(_updates: Partial<User>): User {
    // This will be implemented later with actual Supabase update
    throw new Error('Not implemented - use Supabase directly');
  },

  async loginWithGoogle(): Promise<User> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    // The actual user data will be available after redirect
    throw new Error('Redirecting to Google...');
  },
};

export const analyticsApi = {
  async getAnalytics() {
    // Mock analytics data
    return {
      totalViews: 12500,
      totalCTR: 3.5,
      totalConversions: 450,
      totalRevenue: 15000,
      scriptsCount: 25,
      videosCount: 18,
      productsCount: 12,
    };
  },
};

export const initializeMockData = () => {
  // Mock data initialization - can be used to seed localStorage or state
  console.log('Mock data initialized');
};

export const productApi = {
  getProducts: () => {
    // Return empty array for now - can be populated with mock data
    return [];
  },

  extractFromUrl: async (url: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/extract-product`, { url });
      const productData = response.data.data;

      // Save for persistence
      const saved = localStorage.getItem('affiliator_products');
      const products = saved ? JSON.parse(saved) : [];
      localStorage.setItem('affiliator_products', JSON.stringify([...products, productData]));

      return productData;
    } catch (error) {
      console.warn('Extraction failed, using mock fallback:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Sample Product (Fallback)',
        description: 'Extracted from ' + url,
        price: 99000,
        originalPrice: 150000,
        discount: 34,
        rating: 4.5,
        soldCount: '1.2k',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        platform: 'shopee' as const,
        productUrl: url,
        category: 'Fashion',
        keyFeatures: ['High Quality', 'Fast Shipping'],
        viralScore: 8.5,
        usp: ['Trending', 'Best Seller'],
        contentAngles: ['Review', 'Unboxing'],
        extractedAt: new Date().toISOString(),
      };

      const saved = localStorage.getItem('affiliator_products');
      const products = saved ? JSON.parse(saved) : [];
      localStorage.setItem('affiliator_products', JSON.stringify([...products, mockProduct]));

      return mockProduct;
    }
  },

  deleteProduct: (id: string) => {
    console.log('Deleting product:', id);
  },

  getProductById: (id: string) => {
    console.log('Getting product:', id);
    return null;
  },
};

export const scriptApi = {
  getScripts: (): Script[] => {
    const saved = localStorage.getItem('affiliator_scripts');
    return saved ? JSON.parse(saved) : [];
  },

  getScriptById: (id: string): Script | null => {
    const scripts = scriptApi.getScripts();
    return scripts.find(s => s.id === id) || null;
  },

  generateScript: async (
    productId: string,
    framework: string,
    platform: string,
    tone: string
  ): Promise<Script> => {
    try {
      const prompt = `Generate a viral short-form video script for an affiliate product.
      Product: ${productId}
      Framework: ${framework}
      Platform: ${platform}
      Tone: ${tone}
      
      Return ONLY a JSON object with this structure:
      {
        "title": "Script Title",
        "modules": [
          { "type": "hook", "content": "Viral hook here", "duration": "00:05" },
          { "type": "problem", "content": "The problem it solves", "duration": "00:10" },
          { "type": "solution", "content": "How it solves it", "duration": "00:15" },
          { "type": "cta", "content": "Call to action", "duration": "00:05" }
        ]
      }`;

      const response = await axios.post(`${API_URL}/api/generate-content`, { prompt });
      const content = response.data.data;
      const cleanJson = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const newScript: Script = {
        id: Math.random().toString(36).substr(2, 9),
        title: parsed.title,
        productId,
        framework: framework as any,
        platform: platform as any,
        tone: tone as any,
        modules: parsed.modules.map((m: any, i: number) => ({
          ...m,
          id: `m${i}`,
          order: i,
        })),
        totalDuration: "00:35",
        score: 92,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const scripts = scriptApi.getScripts();
      localStorage.setItem('affiliator_scripts', JSON.stringify([...scripts, newScript]));
      return newScript;
    } catch (error) {
      console.warn('AI Generation failed, falling back to mock:', error);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newScript: Script = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Script for ${productId} (Mock)`,
        productId,
        framework: framework as any,
        platform: platform as any,
        tone: tone as any,
        modules: [
          { id: 'm1', type: 'hook', content: 'Did you know about this product?', duration: '00:05', order: 0 },
          { id: 'm2', type: 'problem', content: 'Regular products are boring.', duration: '00:10', order: 1 },
          { id: 'm3', type: 'solution', content: 'This one is actually amazing!', duration: '00:15', order: 2 },
          { id: 'm4', type: 'cta', content: 'Check it out now!', duration: '00:05', order: 3 },
        ],
        totalDuration: '00:35',
        score: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const scripts = scriptApi.getScripts();
      localStorage.setItem('affiliator_scripts', JSON.stringify([...scripts, newScript]));
      return newScript;
    }
  },

  regenerateModule: async (scriptId: string, moduleId: string): Promise<ScriptModule> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const scripts = scriptApi.getScripts();
    const scriptIndex = scripts.findIndex(s => s.id === scriptId);

    if (scriptIndex === -1) throw new Error('Script not found');

    const moduleIndex = scripts[scriptIndex].modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) throw new Error('Module not found');

    const newContent = `Regenerated content for ${scripts[scriptIndex].modules[moduleIndex].type} at ${new Date().toLocaleTimeString()}`;

    scripts[scriptIndex].modules[moduleIndex].content = newContent;
    scripts[scriptIndex].updatedAt = new Date().toISOString();

    localStorage.setItem('affiliator_scripts', JSON.stringify(scripts));

    return scripts[scriptIndex].modules[moduleIndex];
  },

  updateScript: (id: string, updates: Partial<Script>) => {
    const scripts = scriptApi.getScripts();
    const index = scripts.findIndex(s => s.id === id);
    if (index !== -1) {
      scripts[index] = { ...scripts[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('affiliator_scripts', JSON.stringify(scripts));
    }
  },

  deleteScript: (id: string) => {
    const scripts = scriptApi.getScripts();
    localStorage.setItem('affiliator_scripts', JSON.stringify(scripts.filter(s => s.id !== id)));
  },
};

export const videoApi = {
  getVideos: (): Video[] => {
    const saved = localStorage.getItem('affiliator_videos');
    return saved ? JSON.parse(saved) : [];
  },

  generateVideo: async (scriptId: string, style: string): Promise<Video> => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    // We would normally fetch the script title here
    const scripts = scriptApi.getScripts();
    const script = scripts.find(s => s.id === scriptId);
    const title = script ? `Video: ${script.title}` : `Video for Script ${scriptId}`;

    const newVideo: Video = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      scriptId,
      style: style as any,
      status: 'completed',
      duration: '00:35',
      resolution: '1080p',
      thumbnailUrl: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80`,
      videoUrl: '#',
      createdAt: new Date().toISOString(),
    };

    const videos = videoApi.getVideos();
    localStorage.setItem('affiliator_videos', JSON.stringify([...videos, newVideo]));

    return newVideo;
  },

  deleteVideo: (id: string) => {
    const videos = videoApi.getVideos();
    localStorage.setItem('affiliator_videos', JSON.stringify(videos.filter(v => v.id !== id)));
  },
};

export const trendingApi = {
  getTrending: async (): Promise<TrendingItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
      {
        id: '1',
        type: 'sound',
        name: 'Chill Lofi Beat 2026',
        platform: 'TikTok',
        popularity: 95,
        growth: '+150%',
        category: 'Music',
      },
      {
        id: '2',
        type: 'hashtag',
        name: '#AffiliateMarketingTips',
        platform: 'Instagram',
        popularity: 88,
        growth: '+85%',
        category: 'Education',
      },
      {
        id: '3',
        type: 'product',
        name: 'Wireless Ergonomic Mouse',
        platform: 'Shopee',
        popularity: 92,
        growth: '+210%',
        category: 'Electronics',
      },
      {
        id: '4',
        type: 'sound',
        name: 'Funny Laugh Track',
        platform: 'TikTok',
        popularity: 98,
        growth: '+320%',
        category: 'Comedy',
      },
      {
        id: '5',
        type: 'hashtag',
        name: '#ShopeeHaul2026',
        platform: 'Shopee',
        popularity: 85,
        growth: '+45%',
        category: 'Shopping',
      },
      {
        id: '6',
        type: 'product',
        name: 'Minimalist Water Bottle',
        platform: 'TikTok',
        popularity: 78,
        growth: '+120%',
        category: 'Lifestyle',
      },
    ];
  },
};

export const abTestApi = {
  getTests: async (): Promise<ABTest[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: '1',
        name: 'Serum Hook Test',
        status: 'completed',
        variants: [
          { id: 'v1', name: 'Version A - Question Hook', script: 'Masih buang 500rb buat serum?', views: 12500, ctr: 3.2, conversions: 45 },
          { id: 'v2', name: 'Version B - Stop Hook', script: 'STOP! Jangan beli serum mahal!', views: 13200, ctr: 4.5, conversions: 68 },
        ],
        startDate: '2026-01-15',
        endDate: '2026-01-22',
        totalViews: 25700,
        winner: 'v2',
      },
      {
        id: '2',
        name: 'Hijab CTA Test',
        status: 'running',
        variants: [
          { id: 'v1', name: 'Version A - Link in Bio', script: 'Link di bio, buruan!', views: 8400, ctr: 2.8, conversions: 28 },
          { id: 'v2', name: 'Version B - Comment for Link', script: 'Ketik LINK di komen!', views: 7900, ctr: 3.1, conversions: 32 },
          { id: 'v3', name: 'Version C - Swipe Up', script: 'Swipe up sekarang!', views: 6200, ctr: 2.5, conversions: 19 },
        ],
        startDate: '2026-01-25',
        totalViews: 22500,
      },
    ];
  },
};

export const marketplaceApi = {
  getBrands: async (): Promise<MarketplaceBrand[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        name: 'GlowSkincare Official',
        category: 'beauty',
        logo: '/avatar-1.png',
        description: 'Premium Korean skincare products with proven results',
        commission: '15%',
        avgOrder: 'Rp 250K',
        conversionRate: '4.2%',
        rating: 4.8,
        campaigns: 12,
        creators: 340,
        isVerified: true,
        isPopular: true,
        products: ['Serum Vitamin C', 'Moisturizer', 'Sunscreen'],
      },
      {
        id: '2',
        name: 'HijabChic Indonesia',
        category: 'fashion',
        logo: '/avatar-3.png',
        description: 'Modern hijab fashion for the stylish Muslimah',
        commission: '12%',
        avgOrder: 'Rp 180K',
        conversionRate: '3.8%',
        rating: 4.7,
        campaigns: 8,
        creators: 520,
        isVerified: true,
        isPopular: true,
        products: ['Hijab Instan', 'Gamis', 'Tunik'],
      },
      {
        id: '3',
        name: 'TechGear ID',
        category: 'tech',
        logo: '/avatar-2.png',
        description: 'Quality phone accessories and gadgets at affordable prices',
        commission: '10%',
        avgOrder: 'Rp 120K',
        conversionRate: '5.1%',
        rating: 4.6,
        campaigns: 15,
        creators: 280,
        isVerified: true,
        isPopular: false,
        products: ['Phone Case', 'Charger', 'Earbuds'],
      },
    ];
  },
};

export const templateApi = {
  getTemplates: async (): Promise<Template[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: '1',
        name: 'Skincare Routine Review',
        category: 'beauty',
        description: 'Perfect for reviewing skincare products with before/after format',
        framework: 'AIDA',
        platform: 'TikTok',
        rating: 4.8,
        uses: 2340,
        preview: 'Masih bingung skincare routine? Ini rahasia kulit glowing...',
        tags: ['skincare', 'glowing', 'routine'],
        isNew: true,
      },
      {
        id: '2',
        name: 'Hijab Styling Tutorial',
        category: 'fashion',
        description: 'Showcase different hijab styles with product recommendations',
        framework: 'BAB',
        platform: 'Instagram',
        rating: 4.9,
        uses: 1890,
        preview: '5 gaya hijab simple tapi elegan untuk daily...',
        tags: ['hijab', 'tutorial', 'style'],
        isNew: false,
      },
      {
        id: '3',
        name: 'Phone Case Drop Test',
        category: 'tech',
        description: 'Drop test format for phone accessories and cases',
        framework: 'PAS',
        platform: 'TikTok',
        rating: 4.7,
        uses: 3200,
        preview: 'Drop test case murah vs mahal, hasilnya MENGEJUTKAN!',
        tags: ['phone', 'case', 'review'],
        isNew: true,
      },
    ];
  },
};

