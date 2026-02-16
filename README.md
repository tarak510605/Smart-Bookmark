# Smart Bookmark App

A production-ready, real-time bookmark manager built with Next.js 14, TypeScript, Supabase, and Google OAuth. Features instant synchronization across multiple tabs and devices.

## 🚀 Features

- **Google OAuth Authentication** - Secure sign-in with Google via Supabase Auth
- **Real-time Synchronization** - Instant updates across multiple tabs using Supabase Realtime
- **Private Bookmarks** - Each user's bookmarks are completely private with Row Level Security
- **Modern UI** - Clean, responsive interface built with Tailwind CSS
- **Production Ready** - Fully deployable to Vercel with proper environment variable handling
- **Type Safety** - Full TypeScript implementation throughout

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code throughout
- **Supabase** - Backend as a Service (Auth, Database, Realtime)
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Deployment platform

## 📁 Project Structure

```
smart-bookmark-app/
├── app/                          # Next.js App Router
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard page (protected)
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── AddBookmarkForm.tsx       # Form to add bookmarks
│   ├── BookmarkList.tsx          # Display bookmarks
│   ├── DashboardClient.tsx       # Dashboard client component
│   ├── GoogleSignInButton.tsx    # Google OAuth button
│   └── LogoutButton.tsx          # Logout functionality
├── lib/                          # Utilities and helpers
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── middleware.ts         # Middleware helper
│   └── types/
│       └── database.ts           # TypeScript database types
├── middleware.ts                 # Next.js middleware
├── supabase-setup.sql            # Database setup SQL
├── .env.example                  # Environment variables example
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🏗️ Architecture

### Server vs Client Components

This app uses Next.js 14 App Router with a strategic mix of Server and Client Components:

**Server Components** (default):
- `app/page.tsx` - Handles authentication check and redirects
- `app/login/page.tsx` - Login page with server-side auth check
- `app/dashboard/page.tsx` - Fetches initial bookmarks server-side

**Client Components** (marked with `'use client'`):
- `components/GoogleSignInButton.tsx` - Interactive OAuth button
- `components/LogoutButton.tsx` - Logout functionality
- `components/AddBookmarkForm.tsx` - Form with state management
- `components/BookmarkList.tsx` - Interactive list with delete
- `components/DashboardClient.tsx` - Real-time subscriptions

### Authentication Flow

1. User visits the app → redirected to `/login`
2. Clicks "Sign in with Google" → Supabase OAuth flow
3. Google authenticates → redirects to `/auth/callback`
4. Callback exchanges code for session → creates cookies
5. User redirected to `/dashboard`
6. Session persisted via HTTP-only cookies
7. Middleware refreshes session on each request

### Database Architecture

**Table: bookmarks**
```sql
id          UUID (Primary Key)
user_id     UUID (Foreign Key → auth.users)
title       TEXT
url         TEXT
created_at  TIMESTAMP WITH TIME ZONE
```

**Row Level Security (RLS)**:
- SELECT: Users can only see their own bookmarks
- INSERT: Users can only create bookmarks for themselves
- DELETE: Users can only delete their own bookmarks

RLS policies automatically filter queries based on `auth.uid()`, ensuring complete data isolation between users.

### Real-time Implementation

Uses Supabase Realtime subscriptions to listen for database changes:

```typescript
supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Update UI instantly
  })
  .subscribe()
```

When a bookmark is added or deleted in one tab, all other tabs automatically update without page refresh.

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google Cloud Platform account for OAuth

### 1. Clone and Install

```bash
cd Company-Assignment
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
   - Choose a name
   - Create a strong database password
   - Select a region close to you
   - Wait 2-3 minutes for setup

#### Configure Database

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql`
4. Paste and click "Run"
5. Verify success (should see "Success. No rows returned")

#### Enable Google OAuth

1. In Supabase, go to **Authentication** → **Providers**
2. Find "Google" and click to expand
3. Toggle "Enable Sign in with Google"

**Get Google OAuth Credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure consent screen (if first time)
   - User Type: External
   - App name: Smart Bookmark App
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID
   - Application type: Web application
   - Name: Smart Bookmark App
   - Authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     (Find your project ref in Supabase Settings → API)

7. Copy the **Client ID** and **Client Secret**
8. Paste them into Supabase Google provider settings
9. Click "Save"

#### Configure Site URL and Redirect URLs

In Supabase, go to **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:3000` (for local dev)
- **Redirect URLs**: Add:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/**` (wildcard for all local paths)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Find these values:**
- Supabase Dashboard → **Settings** → **API**
- Copy "Project URL" and "anon/public" key

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/smart-bookmark-app.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
```

Add to: **Production**, **Preview**, and **Development**

### 4. Update Supabase URLs

After deployment, update Supabase **URL Configuration**:

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Update **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/**`

4. Update Google OAuth redirect URIs:
   - Add: `https://<your-project-ref>.supabase.co/auth/v1/callback`

### 5. Redeploy

Click "Redeploy" in Vercel dashboard to apply environment variables.

## 🧪 Testing

### Test Authentication

1. Open the app in your browser
2. Click "Sign in with Google"
3. Authenticate with Google
4. Should redirect to dashboard

### Test Real-time Sync

1. Open the app in two different tabs
2. In Tab 1: Add a bookmark
3. In Tab 2: Bookmark should appear instantly (no refresh)
4. In Tab 1: Delete a bookmark
5. In Tab 2: Bookmark should disappear instantly

### Test Privacy (RLS)

1. Sign in with one Google account → add bookmarks
2. Sign out → sign in with different Google account
3. Should see NO bookmarks from the first account
4. Each user's bookmarks are completely isolated

## 🐛 Common Issues & Solutions

### Issue: "Failed to add bookmark" or "403 Forbidden"

**Cause**: Row Level Security (RLS) is blocking the insert

**Solution**:
1. Verify RLS policies are created correctly
2. Check that `user_id` matches `auth.uid()`
3. Run this query in Supabase SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
   ```
4. Should see 3 policies (SELECT, INSERT, DELETE)
5. Re-run `supabase-setup.sql` if policies are missing

### Issue: Real-time updates not working

**Cause**: Realtime not enabled for the table

**Solution**:
1. Go to Supabase → **Database** → **Replication**
2. Find `bookmarks` table
3. Toggle replication ON
4. Or run: `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;`

### Issue: "Missing Supabase environment variables"

**Cause**: `.env.local` not found or incorrect

**Solution**:
1. Verify `.env.local` exists in project root
2. Check variable names match exactly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart dev server: `npm run dev`

### Issue: Google OAuth redirect problems

**Cause**: Redirect URLs not configured correctly

**Solution**:
1. Check Supabase → **Authentication** → **URL Configuration**
2. Verify redirect URLs include:
   - `http://localhost:3000/auth/callback` (local)
   - `https://your-app.vercel.app/auth/callback` (production)
3. Check Google Cloud Console → Credentials
4. Verify authorized redirect URI:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`

### Issue: Vercel deployment works but authentication fails

**Cause**: Environment variables not set in Vercel

**Solution**:
1. Go to Vercel project → **Settings** → **Environment Variables**
2. Verify both variables are set
3. Click "Redeploy" to apply changes
4. Check Supabase site URL matches Vercel URL

### Issue: "Session expired" or constant logouts

**Cause**: Cookie issues or middleware problems

**Solution**:
1. Clear browser cookies
2. Verify `middleware.ts` is in the root directory
3. Check middleware config matches all routes except static files
4. Test in incognito/private window

## 📚 Key Concepts

### Why App Router?

Next.js 14 App Router provides:
- **Server Components by default** - Better performance, smaller bundles
- **Streaming & Suspense** - Progressive page rendering
- **Simplified data fetching** - Fetch in components, not separate functions
- **Better TypeScript support** - Type-safe params and search params

### Why Supabase?

- **Complete backend solution** - Auth, database, storage, real-time
- **PostgreSQL** - Powerful, mature database
- **Row Level Security** - Database-level access control
- **Real-time subscriptions** - WebSocket-based updates
- **Generous free tier** - Perfect for production apps

### Why Real-time?

Traditional apps require:
- Manual refresh to see changes
- Polling (inefficient, delayed updates)
- Complex WebSocket setup

Supabase Realtime provides:
- Instant updates via WebSockets
- Automatic reconnection
- Filtered subscriptions (only relevant changes)
- Zero configuration required

### Security Best Practices Implemented

1. **Row Level Security (RLS)** - Database enforces access control
2. **HTTP-only cookies** - Session tokens not accessible to JavaScript
3. **Server-side auth checks** - Protected routes verify on server
4. **Environment variables** - Secrets never committed to code
5. **OAuth 2.0** - Industry-standard authentication
6. **HTTPS enforced** - Encrypted communication (Vercel default)

## 🤝 Contributing

This is a complete, production-ready implementation. Feel free to:
- Fork and customize for your needs
- Add features (tags, search, folders)
- Improve UI/UX
- Deploy and share!

## 📄 License

MIT License - feel free to use this code for any purpose.

## 🙋 Support

If you encounter issues:
1. Check the "Common Issues & Solutions" section above
2. Verify all setup steps were completed
3. Check browser console for errors
4. Check Supabase logs (Dashboard → Logs)
5. Ensure environment variables are correct

## ✅ Verification Checklist

Before deploying, verify:

- [ ] Supabase project created
- [ ] Database setup SQL executed successfully
- [ ] Google OAuth credentials configured
- [ ] Redirect URLs added (local and production)
- [ ] Environment variables set (.env.local for local)
- [ ] App runs locally (`npm run dev`)
- [ ] Can sign in with Google
- [ ] Can add bookmarks
- [ ] Can delete bookmarks
- [ ] Real-time sync works (test with 2 tabs)
- [ ] Bookmarks are private (test with 2 accounts)
- [ ] Environment variables set in Vercel
- [ ] Production site URL updated in Supabase
- [ ] Production Google redirect URI configured
- [ ] Deployed app accessible
- [ ] Production authentication works

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**

Ready to manage your bookmarks the smart way!
