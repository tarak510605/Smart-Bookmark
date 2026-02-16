'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import { Bookmark, Database } from '@/lib/types/database'
import { useState } from 'react'

interface AddBookmarkFormProps {
  userId: string
  onBookmarkAdded: (bookmark: Bookmark) => void
}

export default function AddBookmarkForm({ userId, onBookmarkAdded }: AddBookmarkFormProps) {
  const supabase = createBrowserClient()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!title.trim() || !url.trim()) {
      setError('Both title and URL are required')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL (include http:// or https://)')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Inserting bookmark:', { userId, title: title.trim(), url: url.trim() })
      
      const { data, error: insertError } = await (supabase
        .from('bookmarks') as any)
        .insert({
          user_id: userId,
          title: title.trim(),
          url: url.trim(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting bookmark:', insertError)
        setError('Failed to add bookmark. Please try again.')
        return
      }

      if (data) {
        console.log('Bookmark inserted successfully:', data)
        onBookmarkAdded(data)
        setTitle('')
        setUrl('')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Add Bookmark</h2>
      </div>
      
      {error && (
        <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-2 text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">{error}</span>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="My awesome website"
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
          URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Bookmark
          </>
        )}
      </button>
    </form>
  )
}
