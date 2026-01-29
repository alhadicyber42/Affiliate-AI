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
  getProducts: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  },

  extractFromUrl: async (url: string, userId: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/extract-product`, { url, userId });
      return response.data.data;
    } catch (error) {
      console.error('Extraction failed:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  getProductById: async (id: string, userId: string) => {
    try {
      const products = await productApi.getProducts(userId);
      return products.find((p: any) => p.id === id) || null;
    } catch (error) {
      console.error('Get product by ID error:', error);
      return null;
    }
  },
};

export const scriptApi = {
  getScripts: async (userId: string): Promise<Script[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/scripts/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get scripts error:', error);
      return [];
    }
  },

  getScriptById: async (id: string, userId: string): Promise<Script | null> => {
    try {
      const scripts = await scriptApi.getScripts(userId);
      return scripts.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Get script by ID error:', error);
      return null;
    }
  },

  generateScript: async (
    userId: string,
    productId: string,
    framework: string,
    platform: string,
    tone: string
  ): Promise<Script> => {
    try {
      const response = await axios.post(`${API_URL}/api/generate-script`, {
        userId,
        productId,
        framework,
        platform,
        tone,
      });
      return response.data.data;
    } catch (error) {
      console.error('Generate script error:', error);
      throw error;
    }
  },

  regenerateModule: async (scriptId: string, moduleId: string): Promise<ScriptModule> => {
    try {
      const response = await axios.post(`${API_URL}/api/regenerate-module`, {
        scriptId,
        moduleId,
      });
      return response.data.data;
    } catch (error) {
      console.error('Regenerate module error:', error);
      throw error;
    }
  },

  updateScript: async (id: string, updates: Partial<Script>) => {
    // TODO: Implement update script endpoint
    console.log('Update script:', id, updates);
  },

  deleteScript: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/scripts/${id}`);
    } catch (error) {
      console.error('Delete script error:', error);
      throw error;
    }
  },
};

export const videoApi = {
  getVideos: async (userId: string): Promise<Video[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/videos/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get videos error:', error);
      return [];
    }
  },

  generateVideo: async (userId: string, scriptId: string, style: string): Promise<Video> => {
    try {
      const response = await axios.post(`${API_URL}/api/generate-video`, {
        userId,
        scriptId,
        style,
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 402) {
        throw new Error(`Insufficient credits. Need ${error.response.data.required}, have ${error.response.data.available}`);
      }
      console.error('Generate video error:', error);
      throw error;
    }
  },

  deleteVideo: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/videos/${id}`);
    } catch (error) {
      console.error('Delete video error:', error);
      throw error;
    }
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

