'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function RootPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirect authenticated users to /home (Owner Dashboard), others to /login
      router.replace(user ? '/home' : '/login')
    }
  }, [user, loading, router])

  // Blank while checking auth
  return null
}
