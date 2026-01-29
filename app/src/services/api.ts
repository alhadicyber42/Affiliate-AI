// Real API Service - No Mock Data
// All data comes from backend/database

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

// ============================================
// AUTHENTICATION API (Real - Supabase)
// ============================================
export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name,
        email,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        plan: 'free',
      });

    if (profileError) console.error('Profile creation error:', profileError);

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
};

// ============================================
// PRODUCTS API (Real - Backend + Puppeteer)
// ============================================
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

// ============================================
// SCRIPTS API (Real - Backend + AI)
// ============================================
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

  deleteScript: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/scripts/${id}`);
    } catch (error) {
      console.error('Delete script error:', error);
      throw error;
    }
  },
};

// ============================================
// VIDEOS API (Real - Backend)
// ============================================
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

// ============================================
// ANALYTICS API (Real - Backend)
// ============================================
export const analyticsApi = {
  async getAnalytics(userId: string) {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      return {
        totalViews: 0,
        totalCTR: 0,
        totalConversions: 0,
        totalRevenue: 0,
        scriptsCount: 0,
        videosCount: 0,
        productsCount: 0,
      };
    }
  },
};

// ============================================
// AB TESTING API (Real - Backend)
// ============================================
export const abTestApi = {
  getTests: async (userId: string): Promise<ABTest[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/ab-tests/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get AB tests error:', error);
      return [];
    }
  },

  createTest: async (userId: string, name: string, variants: any[]): Promise<ABTest> => {
    try {
      const response = await axios.post(`${API_URL}/api/ab-tests`, {
        userId,
        name,
        variants,
      });
      return response.data.data;
    } catch (error) {
      console.error('Create AB test error:', error);
      throw error;
    }
  },
};

// ============================================
// TRENDING API (External/Public Data)
// ============================================
// Note: This is external data, not user-specific
// TODO: Integrate with real trending APIs (TikTok Trends, Google Trends)
export const trendingApi = {
  getTrending: async (): Promise<TrendingItem[]> => {
    // Placeholder for external trending data
    return [];
  },
};

// ============================================
// MARKETPLACE API (External/Public Data)
// ============================================
// Note: This represents available brand partnerships
// TODO: Integrate with affiliate networks
export const marketplaceApi = {
  getBrands: async (): Promise<MarketplaceBrand[]> => {
    // Placeholder for marketplace data
    return [];
  },
};

// ============================================
// TEMPLATES API (Platform Data)
// ============================================
// Note: These are pre-built templates provided by platform
// TODO: Store in database for admin management
export const templateApi = {
  getTemplates: async (): Promise<Template[]> => {
    // Placeholder for templates
    return [];
  },
};
