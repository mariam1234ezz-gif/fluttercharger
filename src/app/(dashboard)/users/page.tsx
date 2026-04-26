'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { StatCard, Card, Badge, Button, AlertCard } from '@/components/Cards'
import { Users, AlertCircle } from 'lucide-react'
import { useUsersData, User } from '@/hooks/useUsers'

export default function UsersPage() {
  const { users, loading, error } = useUsersData()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  if (loading) {
    return (
      <div>
        <Header title="User Management" description="View and manage all registered users" />
        <main className="p-6">
          <div className="text-gray-400">Loading users from Firebase...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="User Management" description="Error loading users" />
        <main className="p-6">
          <AlertCard
            title="Firebase Error"
            icon={AlertCircle}
            message={`Failed to load users: ${error}`}
            severity="critical"
          />
        </main>
      </div>
    )
  }

  return (
    <div>
      <Header title="User Management" description="View and manage all registered users" />

      <main className="p-6 space-y-6">
        {/* Total Users Count */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={users.length} icon={Users} color="info" />
          <StatCard label="Active Users" value={users.filter((u) => u.status === 'active').length} icon={Users} color="success" />
          <StatCard label="Owners" value={users.filter((u) => u.role === 'owner').length} icon={Users} color="primary" />
          <StatCard label="Operators" value={users.filter((u) => u.role === 'operator').length} icon={Users} color="warning" />
        </div>

        {/* Users List */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">All Users</h2>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Station</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'owner' ? 'success' : user.role === 'operator' ? 'warning' : 'info'}>{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{user.assigned_station || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <Button variant="secondary" size="sm" onClick={() => setSelectedUser(user)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No users found in Firebase</p>
          )}
        </Card>

        {/* User Details Panel */}
        {selectedUser && (
          <Card className="border-2 border-blue-500/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-200 text-2xl">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">User ID</p>
                  <p className="font-mono text-white break-all">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Name</p>
                  <p className="text-white font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Email</p>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
              </div>

              {/* Status Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Role</p>
                  <Badge variant={selectedUser.role === 'owner' ? 'success' : selectedUser.role === 'operator' ? 'warning' : 'info'}>{selectedUser.role}</Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <Badge variant={selectedUser.status === 'active' ? 'success' : 'warning'}>{selectedUser.status}</Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Assigned Station</p>
                  <p className="text-white">{selectedUser.assigned_station || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            {(selectedUser.createdAt || selectedUser.lastLogin) && (
              <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-2 gap-4">
                {selectedUser.createdAt && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Created At</p>
                    <p className="text-gray-300 text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedUser.lastLogin && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Last Login</p>
                    <p className="text-gray-300 text-sm">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  )
}