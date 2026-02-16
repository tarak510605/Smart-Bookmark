'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import { Bookmark } from '@/lib/types/database'
import { useState, useEffect } from 'react'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onBookmarkDeleted?: (id: string) => void
}

export default function BookmarkList({ bookmarks, onBookmarkDeleted }: BookmarkListProps) {
  const supabase = createBrowserClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    setDeletingId(id)

    try {
      console.log('Deleting bookmark:', id)
      
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting bookmark:', error)
        alert('Failed to delete bookmark. Please try again.')
      } else {
        console.log('Bookmark deleted successfully:', id)
        // Optimistically remove from UI
        if (onBookmarkDeleted) {
          onBookmarkDeleted(id)
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-lg text-center border border-white/20">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
        <p className="text-gray-500">Add your first bookmark above to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Your Bookmarks
          </h2>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-full border border-indigo-200">
          <span className="text-xs font-bold text-indigo-600">{bookmarks.length}</span>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="overflow-y-auto px-6 py-4 flex-1">
      
      <div className="space-y-3">
        {bookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className="group flex items-start justify-between p-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1 min-w-0 flex items-start gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1.5 text-base">{bookmark.title}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-xs break-all inline-flex items-center gap-1 group/link"
                >
                  <span className="group-hover/link:underline">{bookmark.url}</span>
                  <svg className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <div className="flex items-center gap-1.5 mt-2">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-500">
                    {formatDate(bookmark.created_at)}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deletingId === bookmark.id}
              className="ml-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md hover:shadow-lg flex items-center gap-1.5 text-xs"
            >
              {deletingId === bookmark.id ? (
                <>
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Deleting</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Delete</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
