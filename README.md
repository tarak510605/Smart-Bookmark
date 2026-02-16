# Smart Bookmark App

A production-ready, real-time bookmark manager built with Next.js 14, TypeScript, Supabase, and Google OAuth.

## 🚀 Features

- **Google OAuth Authentication** - Secure sign-in with Google
- **Real-time Synchronization** - Instant updates across multiple tabs
- **Private Bookmarks** - Each user's bookmarks are completely private
- **Modern UI** - Clean, responsive interface
- **Production Ready** - Deployable to Vercel

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth, Database, Realtime)
- Tailwind CSS

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier)
- Google Cloud Platform account (for OAuth)

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. In SQL Editor, run the contents of `supabase-setup.sql`
3. Enable Google OAuth in Authentication → Providers
4. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
5. Configure redirect URLs in Supabase

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Update Supabase redirect URLs with production URL
5. Deploy

## 🐛 Troubleshooting

**Real-time not working?**
- Go to Supabase → Database → Replication
- Enable replication for `bookmarks` table

**Authentication errors?**
- Verify environment variables are set correctly
- Check redirect URLs in Supabase match your domain

**403 Forbidden errors?**
- Re-run `supabase-setup.sql` to ensure RLS policies are created

## 📄 License

MIT License

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
