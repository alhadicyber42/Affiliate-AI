# Database Setup Guide

## Supabase Database Schema

### Setup Instructions:

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com
   - Login to your account
   - Select your project: `xufgwfnrmqijshgoihot`

2. **Run SQL Schema**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the entire content from `schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - profiles
     - products
     - scripts
     - script_modules
     - videos
     - analytics
     - ab_tests
     - ab_test_variants

4. **Test Authentication**
   - The trigger `on_auth_user_created` will automatically create a profile when a user signs up
   - Test by creating a new account in your app

### Database Structure:

```
profiles (extends auth.users)
├── id (UUID, primary key)
├── email (TEXT, unique)
├── name (TEXT)
├── avatar_url (TEXT)
├── plan (TEXT: free/pro/enterprise)
├── credits (INTEGER, default 100)
└── timestamps

products
├── id (UUID, primary key)
├── user_id (UUID, foreign key)
├── name, description, price, etc.
├── platform (shopee/tokopedia/tiktok/lazada)
├── viral_score, usp, content_angles
└── timestamps

scripts
├── id (UUID, primary key)
├── user_id (UUID, foreign key)
├── product_id (UUID, foreign key)
├── framework (AIDA/PAS/BAB/PASTOR)
├── platform, tone, score
└── timestamps

script_modules
├── id (UUID, primary key)
├── script_id (UUID, foreign key)
├── type (hook/problem/solution/cta)
├── content, duration, order_index
└── timestamp

videos
├── id (UUID, primary key)
├── user_id, script_id (foreign keys)
├── status (processing/completed/failed)
├── video_url, thumbnail_url
└── timestamps
```

### Row Level Security (RLS):

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Automatic user_id validation on INSERT
- Secure data isolation between users

### Next Steps:

After running the schema:
1. Test user registration
2. Test product extraction
3. Test script generation
4. Verify data is being saved correctly
