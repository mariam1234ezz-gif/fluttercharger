'use client'

import { useState } from 'react'
import { auth, rtdb } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Card, Button } from '@/components/Cards'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCred.user

      // Save user data to Realtime Database
      await set(ref(rtdb, 'users/' + user.uid), {
        email: user.email,
        name: fullName || 'New User',
        role: 'owner',
        createdAt: new Date().toISOString(),
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Create Account"
        description="Sign up to access your EV charging station dashboard"
      />

      <main className="p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h1>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-dark-border text-white rounded-lg border border-gray-600 focus:border-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-dark-border text-white rounded-lg border border-gray-600 focus:border-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-dark-border text-white rounded-lg border border-gray-600 focus:border-primary outline-none transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              className="w-full mt-6"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:text-primary-light">
              Log in
            </a>
          </p>
        </Card>
      </main>
    </div>
  )
}
