'use client'

import { useState, useEffect } from 'react'
import { auth, rtdb } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/Cards'
import { useAuth } from '@/components/AuthProvider'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

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

  if (authLoading) return null

  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
      <p className="text-gray-400 text-center mb-6">Sign up to access your charging dashboard</p>

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
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none transition disabled:opacity-50"
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
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none transition disabled:opacity-50"
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
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none transition disabled:opacity-50"
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
          disabled={loading}
          onClick={handleSignup}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-center text-gray-400 text-sm mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
          Log in
        </a>
      </p>
    </Card>
  )
}
