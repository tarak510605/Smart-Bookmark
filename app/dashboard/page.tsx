import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login')
  }

  // Fetch user's bookmarks
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
  }

  return (
    <DashboardClient
      userId={user.id}
      initialBookmarks={bookmarks || []}
      userEmail={user.email || 'Unknown'}
    />
  )
}
