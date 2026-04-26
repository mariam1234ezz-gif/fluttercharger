'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // User not authenticated — redirect to login
      router.replace('/login')
    }
  }, [user, loading, router])

  // While checking auth or loading — show nothing (prevents flash of sidebar)
  if (loading || !user) {
    return null
  }

  // User is authenticated — show sidebar + content
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
