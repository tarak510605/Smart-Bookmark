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

## � Challenges & Solutions

During development, I encountered several technical challenges that required careful debugging and architectural decisions:

### 1. Real-time DELETE Events Missing User Context

**Problem:** DELETE events from Supabase Realtime were inconsistent across different machines. Sometimes the DELETE payload would not include the user ID, making it impossible to filter events properly on the client side. This caused bookmarks to disappear in tabs where they shouldn't, or fail to sync deletions between sessions.

**Solution:** Configured PostgreSQL to use REPLICA IDENTITY FULL on the bookmarks table. This ensures DELETE events include the complete old row payload, allowing reliable client-side filtering. By default, PostgreSQL only includes the primary key in DELETE events, which wasn't sufficient for our multi-user filtering logic.

---

### 2. Multiple Tabs Creating Channel Conflicts

**Problem:** When opening multiple browser tabs, the real-time subscriptions would conflict or fail to sync properly. Sometimes only one tab would receive updates, or tabs would interfere with each other's subscriptions.

**Solution:** Generated a unique channel name for each tab by combining the user ID with a timestamp. This ensures each browser tab maintains its own independent real-time subscription, preventing channel name collisions and allowing proper multi-tab synchronization.

---

### 3. TypeScript Type Errors with Supabase Insert

**Problem:** TypeScript compiler threw errors when calling the insert operation on the bookmarks table, particularly around return types and method chaining requirements.

**Solution:** Used type assertion for the insert operation and properly chained the select and single methods to get the inserted row back from the database. This approach satisfied TypeScript's type checking while maintaining the functionality needed for optimistic UI updates.

---

## �🚦 Quick Start

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
