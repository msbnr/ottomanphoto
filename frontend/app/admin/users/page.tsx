'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users as UsersIcon, Search } from 'lucide-react'
import axios from '@/lib/api'

interface User {
  _id: string
  email: string
  userType: string
  profile: {
    firstName: string
    lastName: string
    phone?: string
    companyName?: string
  }
  createdAt: string
  isActive: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/auth/admin/users')
      setUsers(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ottoman-cream/60">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <UsersIcon className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-serif font-bold text-white">
              Kullanıcılar
            </h1>
          </div>
          <p className="text-ottoman-cream/70">
            Sistemdeki tüm kullanıcıları görüntüleyin
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
            <input
              type="text"
              placeholder="E-posta, ad veya soyada göre ara..."
              className="input-ottoman pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="card-ottoman overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-white font-semibold">Ad Soyad</th>
                  <th className="text-left p-4 text-white font-semibold">E-posta</th>
                  <th className="text-left p-4 text-white font-semibold">Telefon</th>
                  <th className="text-left p-4 text-white font-semibold">Tür</th>
                  <th className="text-left p-4 text-white font-semibold">Şirket</th>
                  <th className="text-left p-4 text-white font-semibold">Kayıt Tarihi</th>
                  <th className="text-left p-4 text-white font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="p-4">
                      <span className="text-ottoman-cream font-medium">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream/80">{user.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream/70">{user.profile?.phone || '-'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.userType === 'admin'
                          ? 'bg-red-500/20 text-red-500'
                          : user.userType === 'dealer'
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {user.userType === 'admin' ? 'Yönetici' : user.userType === 'dealer' ? 'Bayi' : 'Müşteri'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream/70">{user.profile?.companyName || '-'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream/70">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-ottoman-cream/70 text-sm">
            Toplam {filteredUsers.length} kullanıcı gösteriliyor
          </p>
        </div>
      </div>
    </div>
  )
}
