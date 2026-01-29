# Affiliate AI - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Deepseek API key

## 1. Clone Repository

```bash
git clone https://github.com/alhadicyber42/Affiliate-AI.git
cd Affiliate-AI
```

## 2. Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project or use existing
3. Note your project URL and keys

### Step 2: Run Database Schema
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy content from `backend/database/schema.sql`
4. Paste and run in SQL Editor
5. Verify tables created in Table Editor

## 3. Backend Setup

```bash
cd backend
npm install
```

### Configure Environment Variables
Create `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
DEEPSEEK_API_KEY=your_deepseek_api_key
PORT=3000
```

### Start Backend
```bash
npm start
# or
node index.js
```

Backend will run on http://localhost:3000

## 4. Frontend Setup

```bash
cd app
npm install
```

### Configure Environment Variables
Create `app/.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3000
```

### Start Frontend
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## 5. Test Application

### Test Flow:
1. Open http://localhost:5173
2. Click "Get Started" or "Sign In"
3. Register new account
4. Go to Products page
5. Click "Extract Product"
6. Paste product URL (Shopee/Tokopedia/TikTok)
7. Click "Extract"
8. Click "Generate Script" on extracted product
9. View generated script in Scripts page

### Supported Platforms:
- Shopee
- Tokopedia
- TikTok Shop
- Lazada

## 6. Troubleshooting

### Backend not connecting to Supabase
- Check SUPABASE_URL and keys in `.env`
- Verify database schema is created
- Check RLS policies are enabled

### Product extraction fails
- Verify DEEPSEEK_API_KEY is valid
- Check backend logs for errors
- Ensure backend is running on port 3000

### Frontend can't connect to backend
- Verify VITE_API_URL in `app/.env`
- Check backend is running
- Check CORS is enabled in backend

### Authentication issues
- Verify Supabase auth is configured
- Check email confirmation settings
- Verify profile trigger is created

## 7. Production Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy backend code
3. Update VITE_API_URL in frontend

### Frontend (Vercel/Netlify)
1. Set environment variables
2. Build: `npm run build`
3. Deploy `dist` folder

### Database
- Supabase handles scaling automatically
- Monitor usage in Supabase dashboard
- Set up backups if needed

## 8. Development Tips

### Hot Reload
- Frontend: Vite HMR enabled
- Backend: Use nodemon for auto-restart

### Debugging
- Backend logs in terminal
- Frontend: Browser DevTools Console
- Supabase: Check logs in dashboard

### API Testing
Use Postman or curl:
```bash
# Test product extraction
curl -X POST http://localhost:3000/api/extract-product \
  -H "Content-Type: application/json" \
  -d '{"url":"https://shopee.co.id/product/123","userId":"user-id"}'
```

## Need Help?

Check:
- `PROGRESS.md` - Development progress
- `backend/database/README.md` - Database details
- GitHub Issues
