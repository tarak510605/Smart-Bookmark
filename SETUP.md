# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account (free)
- Google Cloud Platform account (free)

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Visit https://supabase.com
2. Create new project
3. Wait 2 minutes for setup

### 3. Setup Database
1. Open Supabase SQL Editor
2. Copy paste `supabase-setup.sql`
3. Click "Run"

### 4. Configure Google OAuth

**In Google Cloud Console:**
1. Create new project
2. Enable Google+ API
3. Create OAuth client ID (Web application)
4. Add authorized redirect URI:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
5. Copy Client ID and Client Secret

**In Supabase:**
1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Paste Client ID and Client Secret
4. Save

### 5. Configure URLs in Supabase
1. Go to Authentication → URL Configuration
2. Site URL: `http://localhost:3000`
3. Add Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`

### 6. Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase → Settings → API

### 7. Run
```bash
npm run dev
```

Visit http://localhost:3000 🎉

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel settings
4. Deploy!
5. Update Supabase Site URL to your Vercel domain
6. Add Vercel domain to Redirect URLs

## ✅ Testing Checklist

- [ ] Can sign in with Google
- [ ] Can add bookmark
- [ ] Can delete bookmark
- [ ] Open 2 tabs, changes sync in real-time
- [ ] Sign out, sign in with different Google account → see different bookmarks

---

Need help? Check README.md for detailed troubleshooting!
