'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users as UsersIcon,
  Search,
  Plus,
  Edit2,
  Trash2,
  Key,
  X,
  Eye,
  EyeOff,
  UserCheck,
  UserX
} from 'lucide-react'
import { authAPI } from '@/lib/api'

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
  dealerTier?: string
  createdAt: string
  isActive: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer',
    dealerTier: 'small',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    taxNumber: '',
  })
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers()
      setUsers(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await authAPI.createUser(formData)
      setShowCreateModal(false)
      resetForm()
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kullanıcı oluşturulurken hata oluştu')
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setError('')

    try {
      await authAPI.updateUser(selectedUser._id, {
        email: formData.email,
        userType: formData.userType,
        dealerTier: formData.dealerTier,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        companyName: formData.companyName,
        taxNumber: formData.taxNumber,
      })
      setShowEditModal(false)
      setSelectedUser(null)
      resetForm()
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kullanıcı güncellenirken hata oluştu')
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await authAPI.deleteUser(selectedUser._id)
      setShowDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Kullanıcı silinirken hata oluştu')
    }
  }

  const handleToggleStatus = async (user: User) => {
    try {
      await authAPI.toggleUserStatus(user._id)
      fetchUsers()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Durum değiştirilirken hata oluştu')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !newPassword) return

    try {
      await authAPI.resetUserPassword(selectedUser._id, newPassword)
      setShowPasswordModal(false)
      setSelectedUser(null)
      setNewPassword('')
      alert('Şifre başarıyla sıfırlandı')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Şifre sıfırlanırken hata oluştu')
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      password: '',
      userType: user.userType,
      dealerTier: user.dealerTier || 'small',
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      phone: user.profile?.phone || '',
      companyName: user.profile?.companyName || '',
      taxNumber: '',
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const openPasswordModal = (user: User) => {
    setSelectedUser(user)
    setNewPassword('')
    setShowPasswordModal(true)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      userType: 'customer',
      dealerTier: 'small',
      firstName: '',
      lastName: '',
      phone: '',
      companyName: '',
      taxNumber: '',
    })
    setError('')
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <UsersIcon className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-serif font-bold text-white">
                Kullanıcı Yönetimi
              </h1>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowCreateModal(true)
              }}
              className="btn-ottoman flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Kullanıcı</span>
            </button>
          </div>
          <p className="text-ottoman-cream/70">
            Sistemdeki tüm kullanıcıları yönetin
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
                  <th className="text-left p-4 text-white font-semibold">Durum</th>
                  <th className="text-left p-4 text-white font-semibold">İşlemler</th>
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
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          user.isActive
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'
                        }`}
                      >
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => openPasswordModal(user)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Şifre Sıfırla"
                        >
                          <Key className="w-4 h-4 text-yellow-400" />
                        </button>
                        {user.userType !== 'admin' && (
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
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

        {/* Create User Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <motion.div
                className="card-ottoman max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Yeni Kullanıcı Oluştur</h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">Ad *</label>
                      <input
                        type="text"
                        className="input-ottoman"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">Soyad *</label>
                      <input
                        type="text"
                        className="input-ottoman"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">E-posta *</label>
                    <input
                      type="email"
                      className="input-ottoman"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Şifre *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input-ottoman pr-12"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-ottoman-cream"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Telefon</label>
                    <input
                      type="tel"
                      className="input-ottoman"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Kullanıcı Türü *</label>
                    <select
                      className="input-ottoman"
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      required
                    >
                      <option value="customer">Müşteri</option>
                      <option value="dealer">Bayi</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  </div>

                  {formData.userType === 'dealer' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">Bayi Seviyesi</label>
                        <select
                          className="input-ottoman"
                          value={formData.dealerTier}
                          onChange={(e) => setFormData({ ...formData, dealerTier: e.target.value })}
                        >
                          <option value="small">Küçük</option>
                          <option value="medium">Orta</option>
                          <option value="large">Büyük</option>
                          <option value="main_dealer">Ana Bayi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">Şirket Adı</label>
                        <input
                          type="text"
                          className="input-ottoman"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">Vergi Numarası</label>
                        <input
                          type="text"
                          className="input-ottoman"
                          value={formData.taxNumber}
                          onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="btn-ottoman flex-1">
                      Kullanıcı Oluştur
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false)
                        resetForm()
                      }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex-1"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit User Modal */}
        <AnimatePresence>
          {showEditModal && selectedUser && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <motion.div
                className="card-ottoman max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Kullanıcı Düzenle</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedUser(null)
                      resetForm()
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <form onSubmit={handleUpdateUser} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">Ad *</label>
                      <input
                        type="text"
                        className="input-ottoman"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">Soyad *</label>
                      <input
                        type="text"
                        className="input-ottoman"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">E-posta *</label>
                    <input
                      type="email"
                      className="input-ottoman"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Telefon</label>
                    <input
                      type="tel"
                      className="input-ottoman"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Kullanıcı Türü *</label>
                    <select
                      className="input-ottoman"
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      required
                    >
                      <option value="customer">Müşteri</option>
                      <option value="dealer">Bayi</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  </div>

                  {formData.userType === 'dealer' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">Bayi Seviyesi</label>
                        <select
                          className="input-ottoman"
                          value={formData.dealerTier}
                          onChange={(e) => setFormData({ ...formData, dealerTier: e.target.value })}
                        >
                          <option value="small">Küçük</option>
                          <option value="medium">Orta</option>
                          <option value="large">Büyük</option>
                          <option value="main_dealer">Ana Bayi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">Şirket Adı</label>
                        <input
                          type="text"
                          className="input-ottoman"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="btn-ottoman flex-1">
                      Güncelle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false)
                        setSelectedUser(null)
                        resetForm()
                      }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex-1"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <motion.div
                className="card-ottoman max-w-md w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <h2 className="text-2xl font-serif font-bold text-white mb-4">Kullanıcıyı Sil</h2>
                <p className="text-ottoman-cream/80 mb-6">
                  <strong>{selectedUser.profile?.firstName} {selectedUser.profile?.lastName}</strong> kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDeleteUser}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex-1"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setSelectedUser(null)
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex-1"
                  >
                    İptal
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Password Reset Modal */}
        <AnimatePresence>
          {showPasswordModal && selectedUser && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <motion.div
                className="card-ottoman max-w-md w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Şifre Sıfırla</h2>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false)
                      setSelectedUser(null)
                      setNewPassword('')
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <p className="text-ottoman-cream/80 mb-4">
                  <strong>{selectedUser.profile?.firstName} {selectedUser.profile?.lastName}</strong> için yeni şifre belirleyin.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Yeni Şifre *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input-ottoman pr-12"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="En az 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-ottoman-cream"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="btn-ottoman flex-1">
                      Şifreyi Sıfırla
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false)
                        setSelectedUser(null)
                        setNewPassword('')
                      }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex-1"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
