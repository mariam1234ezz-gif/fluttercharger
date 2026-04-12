'use client'

import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import Header from '@/components/Header'
import { StatCard, Card, Badge, Button } from '@/components/Cards'
import { Users } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: string
  history?: any
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const usersRef = ref(rtdb, 'users')
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const parsed = Object.keys(data).map((id) => ({
          id,
          name: data[id].name ?? 'Unknown',
          email: data[id].email ?? 'No email',
          role: data[id].role ?? 'user',
          history: data[id].history ?? null,
        }))
        setUsers(parsed)
      } else {
        setUsers([])
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="User Management"
        description="View and manage all registered users"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Total Users Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={users.length}
              icon={Users}
            />
          </div>

          {/* Users List */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">All Users</h2>
            {users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-dark-bg rounded-lg border border-gray-700 hover:border-gray-600 cursor-pointer transition-all"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'owner' ? 'success' : 'info'}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No users found</p>
            )}
          </Card>

          {/* User Details Panel */}
          {selectedUser && (
            <Card className="border-2 border-primary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">User ID</p>
                    <p className="font-monospace text-white font-semibold">{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Role</p>
                    <Badge variant={selectedUser.role === 'owner' ? 'success' : 'info'}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Name</p>
                    <p className="text-white font-semibold">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <p className="text-white font-semibold">{selectedUser.email}</p>
                  </div>
                </div>

                {selectedUser.history && (
                  <div>
                    <p className="text-gray-400 text-xs mb-2">History</p>
                    <pre className="bg-dark-bg p-3 rounded text-sm text-gray-300 overflow-x-auto">
                      {JSON.stringify(selectedUser.history, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}