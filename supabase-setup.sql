-- ================================================
-- SMART BOOKMARK APP - DATABASE SETUP
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- ================================================

-- Create the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON public.bookmarks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;

-- Create RLS Policies

-- Policy: Users can only view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can only insert bookmarks for themselves
CREATE POLICY "Users can insert their own bookmarks"
ON public.bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON public.bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- Enable Realtime (IMPORTANT!)
-- ================================================
-- This enables real-time subscriptions for the bookmarks table

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- Set replica identity to FULL so DELETE events include all columns
-- This is needed for real-time DELETE subscriptions to work properly
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;

-- ================================================
-- VERIFICATION QUERIES (Optional - for testing)
-- ================================================

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookmarks';

-- View all policies
SELECT * FROM pg_policies WHERE tablename = 'bookmarks';

-- ================================================
-- DONE!
-- ================================================
-- Your database is now ready for the Smart Bookmark App
-- ================================================
