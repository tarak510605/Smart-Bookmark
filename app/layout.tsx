import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Bookmark - Save & Sync Your Favorites',
  description: 'A beautiful, real-time bookmark manager with Google authentication. Save, organize, and sync your bookmarks instantly across all your devices.',
  keywords: ['bookmarks', 'bookmark manager', 'real-time sync', 'google auth'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
