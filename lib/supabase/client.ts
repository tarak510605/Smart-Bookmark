import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/types/database'

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
