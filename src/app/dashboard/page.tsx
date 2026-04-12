'use client'

import { useState, useEffect } from 'react'
import { auth, rtdb } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Card, Button, Badge } from '@/components/Cards'
import { LogOut, User } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        router.push('/login')
        return
      }

      setUser(authUser)

      // Fetch user data from Realtime Database
      try {
        const userRef = ref(rtdb, `users/${authUser.uid}`)
        const snapshot = await get(userRef)
        if (snapshot.exists()) {
          setUserData(snapshot.val())
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header title="Dashboard" description="Loading..." />
        <main className="p-6">
          <p className="text-gray-400">Loading your dashboard...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Dashboard"
        description={`Welcome back, ${userData?.name || 'User'}`}
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* User Profile Card */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={32} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{userData?.name || 'User'}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <Badge variant={userData?.role === 'owner' ? 'success' : 'info'} className="mt-2">
                    {userData?.role?.toUpperCase() || 'USER'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="danger"
                size="md"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={20} />
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Account Information */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">User ID</p>
                <p className="text-white font-monospace text-sm break-all">{user?.uid}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Role</p>
                <p className="text-white font-medium capitalize">{userData?.role || 'User'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Account Created</p>
                <p className="text-white font-medium">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/')}
              >
                Go to Home
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/batteries')}
              >
                View Batteries
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/energy')}
              >
                View Energy Data
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
