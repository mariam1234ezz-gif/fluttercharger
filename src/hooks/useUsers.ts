'use client'

import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { rtdb } from '@/lib/firebase'

export interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'operator' | 'user'
  assigned_station?: string
  status: 'active' | 'inactive'
  createdAt?: number
  lastLogin?: number
}

export interface UsersState {
  [userId: string]: User
}

/**
 * Hook to fetch all users real-time from Firebase
 * Path: users/{userId}
 */
export function useUsersData() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const usersRef = ref(rtdb, 'users')
      
      const unsubscribe = onValue(
        usersRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            const usersList: User[] = Object.entries(data).map(([id, userData]: [string, any]) => ({
              id,
              name: userData?.name || 'Unknown',
              email: userData?.email || 'No email',
              role: userData?.role || 'user',
              assigned_station: userData?.assigned_station || undefined,
              status: userData?.status || 'inactive',
              createdAt: userData?.createdAt,
              lastLogin: userData?.lastLogin,
            }))
            setUsers(usersList)
          } else {
            setUsers([])
          }
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('[useUsersData] Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => off(usersRef)
    } catch (err: any) {
      console.error('[useUsersData] Setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  return { users, loading, error }
}

/**
 * Hook to fetch single user data
 */
export function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const userRef = ref(rtdb, `users/${userId}`)
      
      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            setUser({
              id: userId,
              name: data?.name || 'Unknown',
              email: data?.email || 'No email',
              role: data?.role || 'user',
              assigned_station: data?.assigned_station,
              status: data?.status || 'inactive',
              createdAt: data?.createdAt,
              lastLogin: data?.lastLogin,
            })
          } else {
            setUser(null)
          }
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('[useUserData] Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => off(userRef)
    } catch (err: any) {
      console.error('[useUserData] Setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [userId])

  return { user, loading, error }
}
