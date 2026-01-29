-- Quick Fix Script
-- Run this if you're getting errors

-- 1. Check if tables exist
SELECT 'Tables Check:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'products', 'scripts', 'script_modules');

-- 2. Check if your user has a profile
SELECT 'Profile Check:' as status;
SELECT id, email, name, plan, credits 
FROM profiles 
LIMIT 5;

-- 3. If no profiles exist, check auth.users
SELECT 'Auth Users:' as status;
SELECT id, email, created_at 
FROM auth.users 
LIMIT 5;

-- 4. Create missing profile manually (replace USER_ID and EMAIL)
-- Uncomment and edit this if needed:
/*
INSERT INTO profiles (id, email, name, avatar_url, plan, credits)
SELECT 
  id,
  email,
  split_part(email, '@', 1) as name,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' || email as avatar_url,
  'free' as plan,
  100 as credits
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
*/

-- 5. Check RLS policies
SELECT 'RLS Policies:' as status;
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- 6. Check triggers
SELECT 'Triggers:' as status;
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
