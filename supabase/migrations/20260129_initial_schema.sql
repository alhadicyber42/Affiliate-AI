-- Affiliator AI Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  credits INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount INTEGER,
  rating NUMERIC DEFAULT 0,
  sold_count TEXT,
  images TEXT[] NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('shopee', 'tokopedia', 'tiktok', 'lazada')),
  product_url TEXT NOT NULL,
  category TEXT NOT NULL,
  key_features TEXT[],
  viral_score NUMERIC DEFAULT 0,
  usp TEXT[],
  content_angles TEXT[],
  extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  framework TEXT NOT NULL CHECK (framework IN ('AIDA', 'PAS', 'BAB', 'PASTOR')),
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'shopee', 'instagram', 'youtube')),
  tone TEXT NOT NULL CHECK (tone IN ('casual', 'professional', 'energetic', 'empathetic')),
  total_duration TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Script Modules table
CREATE TABLE IF NOT EXISTS script_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hook', 'problem', 'solution', 'benefit', 'social_proof', 'cta', 'transition')),
  content TEXT NOT NULL,
  duration TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  style TEXT NOT NULL CHECK (style IN ('minimal', 'dynamic', 'professional', 'trendy')),
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  duration TEXT,
  resolution TEXT DEFAULT '1080p',
  thumbnail_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AB Tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
  start_date DATE,
  end_date DATE,
  total_views INTEGER DEFAULT 0,
  winner_variant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AB Test Variants table
CREATE TABLE IF NOT EXISTS ab_test_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  script TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_product_id ON scripts(product_id);
CREATE INDEX IF NOT EXISTS idx_script_modules_script_id ON script_modules(script_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for products
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for scripts
CREATE POLICY "Users can view own scripts" ON scripts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scripts" ON scripts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scripts" ON scripts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scripts" ON scripts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for script_modules
CREATE POLICY "Users can view own script modules" ON script_modules FOR SELECT 
  USING (EXISTS (SELECT 1 FROM scripts WHERE scripts.id = script_modules.script_id AND scripts.user_id = auth.uid()));
CREATE POLICY "Users can insert own script modules" ON script_modules FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM scripts WHERE scripts.id = script_modules.script_id AND scripts.user_id = auth.uid()));
CREATE POLICY "Users can update own script modules" ON script_modules FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM scripts WHERE scripts.id = script_modules.script_id AND scripts.user_id = auth.uid()));
CREATE POLICY "Users can delete own script modules" ON script_modules FOR DELETE 
  USING (EXISTS (SELECT 1 FROM scripts WHERE scripts.id = script_modules.script_id AND scripts.user_id = auth.uid()));

-- RLS Policies for videos
CREATE POLICY "Users can view own videos" ON videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own videos" ON videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own videos" ON videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own videos" ON videos FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analytics
CREATE POLICY "Users can view own analytics" ON analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ab_tests
CREATE POLICY "Users can view own ab tests" ON ab_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ab tests" ON ab_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ab tests" ON ab_tests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ab tests" ON ab_tests FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ab_test_variants
CREATE POLICY "Users can view own ab test variants" ON ab_test_variants FOR SELECT 
  USING (EXISTS (SELECT 1 FROM ab_tests WHERE ab_tests.id = ab_test_variants.test_id AND ab_tests.user_id = auth.uid()));
CREATE POLICY "Users can insert own ab test variants" ON ab_test_variants FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM ab_tests WHERE ab_tests.id = ab_test_variants.test_id AND ab_tests.user_id = auth.uid()));
CREATE POLICY "Users can update own ab test variants" ON ab_test_variants FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM ab_tests WHERE ab_tests.id = ab_test_variants.test_id AND ab_tests.user_id = auth.uid()));
CREATE POLICY "Users can delete own ab test variants" ON ab_test_variants FOR DELETE 
  USING (EXISTS (SELECT 1 FROM ab_tests WHERE ab_tests.id = ab_test_variants.test_id AND ab_tests.user_id = auth.uid()));

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
