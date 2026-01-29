// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  credits: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  soldCount: string;
  images: string[];
  platform: 'shopee' | 'tokopedia' | 'tiktok' | 'lazada';
  productUrl: string;
  category: string;
  keyFeatures: string[];
  viralScore: number;
  usp: string[];
  contentAngles: string[];
  extractedAt: string;
}

// Script Types
export type ScriptFramework = 'AIDA' | 'PAS' | 'BAB' | 'PASTOR' | '4Ps';

export interface ScriptModule {
  id: string;
  type: 'hook' | 'problem' | 'solution' | 'benefit' | 'social_proof' | 'cta' | 'custom';
  content: string;
  duration: string;
  order: number;
}

export interface Script {
  id: string;
  title: string;
  productId: string;
  framework: ScriptFramework;
  platform: 'tiktok' | 'shopee' | 'instagram' | 'youtube';
  tone: 'casual' | 'professional' | 'energetic' | 'empathetic';
  modules: ScriptModule[];
  totalDuration: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

// Video Types
export type VideoStyle = 'faceless' | 'avatar' | 'real';

export interface Video {
  id: string;
  title: string;
  scriptId: string;
  style: VideoStyle;
  status: 'generating' | 'completed' | 'failed';
  thumbnailUrl?: string;
  videoUrl?: string;
  duration: string;
  resolution: '720p' | '1080p' | '4K';
  createdAt: string;
}

// Analytics Types
export interface Analytics {
  totalViews: number;
  totalCTR: number;
  totalConversions: number;
  totalRevenue: number;
  scriptsCount: number;
  videosCount: number;
  productsCount: number;
}

// Trending Types
export interface TrendingItem {
  id: string;
  type: 'sound' | 'hashtag' | 'product';
  name: string;
  platform: string;
  popularity: number;
  growth: string;
  category?: string;
}

// Waitlist Types
export interface WaitlistEntry {
  email: string;
  name?: string;
  interest?: string;
  createdAt: string;
}

// A/B Testing Types
export interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'draft';
  variants: {
    id: string;
    name: string;
    script: string;
    views: number;
    ctr: number;
    conversions: number;
  }[];
  startDate: string;
  endDate?: string;
  totalViews: number;
  winner?: string;
}

// Marketplace Types
export interface MarketplaceBrand {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  commission: string;
  avgOrder: string;
  conversionRate: string;
  rating: number;
  campaigns: number;
  creators: number;
  isVerified: boolean;
  isPopular: boolean;
  products: string[];
}

// Template Types
export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  framework: string;
  platform: string;
  rating: number;
  uses: number;
  preview: string;
  tags: string[];
  isNew: boolean;
}
