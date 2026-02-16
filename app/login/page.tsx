import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle diagonal striped pattern */}
      <div className="absolute inset-0 opacity-45" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          #f8fafc 0px,
          #f8fafc 50px,
          #f1f5f9 50px,
          #f1f5f9 100px
        )`
      }}></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/55 via-transparent to-blue-50/55"></div>
      
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full relative z-10 border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Smart Bookmark</h1>
          <p className="text-gray-600">Save and sync your bookmarks in real-time</p>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center justify-center p-3 bg-green-50 rounded-xl">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-green-700">Secure</span>
            </div>
            <div className="flex items-center justify-center p-3 bg-blue-50 rounded-xl">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-blue-700">Real-time</span>
            </div>
          </div>
        </div>

        <GoogleSignInButton />
      </div>
    </div>
  )
}
