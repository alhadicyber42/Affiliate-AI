# Database Setup Guide

## Supabase Database Schema

### ⚠️ IMPORTANT: Follow these steps in order!

### Setup Instructions:

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com
   - Login to your account
   - Select your project: `xufgwfnrmqijshgoihot`

2. **OPTION A: Fresh Install (Recommended)**
   
   If this is your first time or you want to start fresh:
   
   a. Click on "SQL Editor" in the left sidebar
   b. Click "New Query"
   c. Copy the entire content from `schema.sql`
   d. Paste it into the SQL editor
   e. Click "Run" to execute
   f. Wait for success message

3. **OPTION B: Reset Existing Database**
   
   If you already have tables and want to reset:
   
   a. Click on "SQL Editor" in the left sidebar
   b. Click "New Query"
   c. Copy content from `reset-schema.sql`
   d. Paste and click "Run"
   e. Create another "New Query"
   f. Copy content from `schema.sql`
   g. Paste and click "Run"

4. **Verify Tables Created**
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

5. **Verify RLS Policies**
   - Click on any table (e.g., "products")
   - Go to "Policies" tab
   - You should see 4 policies: SELECT, INSERT, UPDATE, DELETE

6. **Test Authentication**
   - The trigger `on_auth_user_created` will automatically create a profile when a user signs up
   - Test by creating a new account in your app
   - Check "profiles" table to see if profile was created

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


### 🔧 Troubleshooting

#### Error: "Could not find the 'category' column"
**Solution:** Database schema not created yet. Run `schema.sql` in Supabase SQL Editor.

#### Error: "relation 'products' already exists"
**Solution:** Tables already exist. Either:
- Use existing tables (if structure matches)
- Run `reset-schema.sql` first, then `schema.sql`

#### Error: "Cannot coerce the result to a single JSON object"
**Solution:** Multiple profiles exist for one user. This happens if:
- You ran schema multiple times
- Profile was created manually
**Fix:** Delete duplicate profiles in Table Editor

#### Error: "permission denied for table products"
**Solution:** RLS policies not created. Re-run the RLS section of `schema.sql`.

#### Error: "insert or update on table violates foreign key constraint"
**Solution:** User profile doesn't exist. Make sure:
- `handle_new_user()` trigger is created
- User has logged in at least once
- Profile exists in `profiles` table

### 📊 Quick Health Check

Run this query in SQL Editor to check your setup:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'products', 'scripts', 'script_modules', 'videos', 'analytics', 'ab_tests', 'ab_test_variants');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check if trigger exists
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Expected results:
- 8 tables found
- All tables have `rowsecurity = true`
- Trigger `on_auth_user_created` exists

### 🚀 After Setup

1. Restart your backend server
2. Clear browser cache/localStorage
3. Register a new account
4. Check if profile was created automatically
5. Try extracting a product
6. Verify data appears in tables

### 📝 Manual Profile Creation (if needed)

If automatic profile creation fails, create manually:

```sql
INSERT INTO profiles (id, email, name, avatar_url, plan, credits)
VALUES (
  'your-user-id-from-auth-users',
  'user@example.com',
  'User Name',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com',
  'free',
  100
);
```

Get your user ID from: Authentication > Users in Supabase Dashboard
