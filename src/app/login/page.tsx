'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const handleLogin = () => {
  console.log('clicked') // 👈 ضيفي دي

  if (email === 'admin' && password === '1234') {
    router.push('/slots')
  } else {
    alert('Wrong credentials')
  }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="bg-dark-card p-8 rounded-xl w-80 space-y-4">
        <h2 className="text-xl font-bold text-white text-center">Login</h2>

        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 rounded bg-dark-border text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-dark-border text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-primary p-2 rounded text-white"
        >
          Login
        </button>
      </div>
    </div>
  )
}