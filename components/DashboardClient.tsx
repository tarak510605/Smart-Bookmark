'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import { Bookmark } from '@/lib/types/database'
import { useEffect, useState } from 'react'
import AddBookmarkForm from './AddBookmarkForm'
import BookmarkList from './BookmarkList'
import LogoutButton from './LogoutButton'

interface DashboardClientProps {
  userId: string
  initialBookmarks: Bookmark[]
  userEmail: string
}

export default function DashboardClient({
  userId,
  initialBookmarks,
  userEmail,
}: DashboardClientProps) {
  const supabase = createBrowserClient()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

  useEffect(() => {
    // Subscribe to realtime changes
    console.log('Setting up real-time subscription for user:', userId)
    
    // Create unique channel name to avoid conflicts between tabs
    const channelName = `bookmarks-${userId}-${Date.now()}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime INSERT received:', payload)
          const newBookmark = payload.new as Bookmark
          setBookmarks((prev) => {
            // Check if bookmark already exists to avoid duplicates
            if (prev.some((b) => b.id === newBookmark.id)) {
              console.log('Bookmark already exists, skipping')
              return prev
            }
            console.log('Adding new bookmark to list via realtime')
            return [newBookmark, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime DELETE received:', payload)
          const deletedId = payload.old.id as string
          console.log('Removing bookmark via realtime:', deletedId)
          setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== deletedId))
        }
      )
      .subscribe((status, err) => {
        console.log('Real-time subscription status:', status)
        if (err) {
          console.error('Real-time subscription error:', err)
        }
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates')
        }
      })

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up real-time subscription')
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  const handleBookmarkAdded = (bookmark: Bookmark) => {
    // Optimistically add the bookmark
    setBookmarks((prev) => {
      // Check if bookmark already exists
      if (prev.some((b) => b.id === bookmark.id)) {
        return prev
      }
      return [bookmark, ...prev]
    })
  }

  const handleBookmarkDeleted = (id: string) => {
    // Optimistically remove the bookmark
    console.log('Optimistically removing bookmark:', id)
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-7xl flex flex-col h-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-6 border border-white/20 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">Smart Bookmarks</h1>
                <p className="text-xs md:text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-xs font-semibold">Live</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Left Column - Fixed Add Form (1/3 width on desktop) */}
          <div className="lg:col-span-1 overflow-y-auto">
            <AddBookmarkForm userId={userId} onBookmarkAdded={handleBookmarkAdded} />
          </div>

          {/* Right Column - Scrollable Bookmarks List (2/3 width on desktop) */}
          <div className="lg:col-span-2 overflow-hidden">
            <BookmarkList bookmarks={bookmarks} onBookmarkDeleted={handleBookmarkDeleted} />
          </div>
        </div>

        {/* Mobile Real-time Indicator */}
        <div className="mt-6 text-center sm:hidden flex-shrink-0">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-5 py-2.5 rounded-full border border-green-200 shadow-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-semibold">Live Updates Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
