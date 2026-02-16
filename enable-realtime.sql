-- Enable real-time for the bookmarks table
-- Run this in Supabase SQL Editor if real-time isn't working

-- Method 1: Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- Method 2 (if above doesn't work): Drop and re-add
-- ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.bookmarks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- Verify it's enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
