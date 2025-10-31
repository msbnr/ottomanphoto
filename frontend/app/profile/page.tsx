'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  User, Lock, MapPin, Save, Plus, Edit2, Trash2,
  CheckCircle, XCircle, Eye, EyeOff, Star
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authAPI } from '@/lib/api'

interface Address {
  _id: string
  title: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault: boolean
}

type Tab = 'profile' | 'password' | 'addresses'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, setUser } = useAuthStore()

  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Profile form
  const [profileData, setProfileData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      companyName: '',
    }
  })

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Address management
  const [addresses, setAddresses] = useState<Address[]>([])
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    title: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'Türkiye',
    postalCode: '',
    isDefault: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile')
      return
    }

    if (user) {
      setProfileData({
        profile: {
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          phone: user.profile?.phone || '',
          companyName: user.profile?.companyName || '',
        }
      })
    }

    fetchAddresses()
  }, [isAuthenticated, user])

  const fetchAddresses = async () => {
    try {
      const response = await authAPI.getAddresses()
      setAddresses(response.data.data.addresses || [])
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await authAPI.updateProfile(profileData)
      setUser({ ...user, ...response.data.data })
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Profil güncellenirken bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' })
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır' })
      setLoading(false)
      return
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setMessage({ type: 'success', text: 'Şifre başarıyla değiştirildi!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (editingAddress) {
        await authAPI.updateAddress(editingAddress._id, addressFormData)
        setMessage({ type: 'success', text: 'Adres başarıyla güncellendi!' })
      } else {
        await authAPI.addAddress(addressFormData)
        setMessage({ type: 'success', text: 'Adres başarıyla eklendi!' })
      }

      await fetchAddresses()
      setShowAddressForm(false)
      setEditingAddress(null)
      setAddressFormData({
        title: '',
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        country: 'Türkiye',
        postalCode: '',
        isDefault: false,
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'İşlem sırasında bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return

    setLoading(true)
    setMessage(null)

    try {
      await authAPI.deleteAddress(addressId)
      setMessage({ type: 'success', text: 'Adres başarıyla silindi!' })
      await fetchAddresses()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Adres silinirken bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressFormData({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    })
    setShowAddressForm(true)
  }

  if (!user) return null

  const tabs = [
    { id: 'profile' as Tab, label: 'Profil Bilgileri', icon: User },
    { id: 'password' as Tab, label: 'Şifre Değiştir', icon: Lock },
    { id: 'addresses' as Tab, label: 'Adreslerim', icon: MapPin },
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-serif font-bold text-white mb-2">
            Hesabım
          </h1>
          <p className="text-ottoman-cream/70">
            Hesap bilgilerinizi yönetin ve güncelleyin
          </p>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              className={`card-ottoman mb-6 ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {message.text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tabs */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="card-ottoman">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setMessage(null)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-ottoman-gold text-black font-semibold'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

              {/* User Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-ottoman-gold/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-ottoman-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {user.profile?.firstName} {user.profile?.lastName}
                    </p>
                    <p className="text-sm text-ottoman-cream/60">{user.email}</p>
                  </div>
                </div>
                {user.userType === 'dealer' && (
                  <div className="mt-4 px-3 py-2 bg-ottoman-gold/10 border border-ottoman-gold/20 rounded-lg">
                    <p className="text-xs text-ottoman-cream/60 mb-1">Bayi Seviyesi</p>
                    <p className="text-ottoman-gold font-semibold">
                      {user.dealerTier === 'small' && 'Küçük Bayi'}
                      {user.dealerTier === 'medium' && 'Orta Bayi'}
                      {user.dealerTier === 'large' && 'Büyük Bayi'}
                      {user.dealerTier === 'main_dealer' && 'Ana Bayi'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  className="card-ottoman"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-serif font-bold text-white mb-6">
                    Profil Bilgileri
                  </h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">
                          Ad *
                        </label>
                        <input
                          type="text"
                          className="input-ottoman"
                          value={profileData.profile.firstName}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            profile: { ...profileData.profile, firstName: e.target.value }
                          })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">
                          Soyad *
                        </label>
                        <input
                          type="text"
                          className="input-ottoman"
                          value={profileData.profile.lastName}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            profile: { ...profileData.profile, lastName: e.target.value }
                          })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">
                          E-posta
                        </label>
                        <input
                          type="email"
                          className="input-ottoman bg-white/5 cursor-not-allowed"
                          value={user.email}
                          disabled
                        />
                        <p className="text-xs text-ottoman-cream/50 mt-1">
                          E-posta adresi değiştirilemez
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          className="input-ottoman"
                          value={profileData.profile.phone}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            profile: { ...profileData.profile, phone: e.target.value }
                          })}
                          placeholder="0555 123 45 67"
                        />
                      </div>
                    </div>

                    {user.userType === 'dealer' && (
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">
                          Firma Adı
                        </label>
                        <input
                          type="text"
                          className="input-ottoman"
                          value={profileData.profile.companyName}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            profile: { ...profileData.profile, companyName: e.target.value }
                          })}
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-ottoman flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <motion.div
                  key="password"
                  className="card-ottoman"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-serif font-bold text-white mb-6">
                    Şifre Değiştir
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        Mevcut Şifre *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          className="input-ottoman pr-12"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ottoman-cream/50 hover:text-ottoman-cream transition-colors"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        Yeni Şifre *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          className="input-ottoman pr-12"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ottoman-cream/50 hover:text-ottoman-cream transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-ottoman-cream/50 mt-1">
                        En az 6 karakter olmalıdır
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        Yeni Şifre (Tekrar) *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          className="input-ottoman pr-12"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ottoman-cream/50 hover:text-ottoman-cream transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-ottoman flex items-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="card-ottoman">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-serif font-bold text-white">
                        Adreslerim
                      </h2>
                      <button
                        onClick={() => {
                          setShowAddressForm(!showAddressForm)
                          setEditingAddress(null)
                          setAddressFormData({
                            title: '',
                            fullName: '',
                            phone: '',
                            street: '',
                            city: '',
                            state: '',
                            country: 'Türkiye',
                            postalCode: '',
                            isDefault: false,
                          })
                        }}
                        className="btn-ottoman-outline flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Yeni Adres
                      </button>
                    </div>

                    {/* Address Form */}
                    {showAddressForm && (
                      <motion.form
                        onSubmit={handleSaveAddress}
                        className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-ottoman-cream mb-2">
                              Adres Başlığı *
                            </label>
                            <input
                              type="text"
                              className="input-ottoman"
                              value={addressFormData.title}
                              onChange={(e) => setAddressFormData({ ...addressFormData, title: e.target.value })}
                              placeholder="Ev, İş, vb."
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-ottoman-cream mb-2">
                              Ad Soyad *
                            </label>
                            <input
                              type="text"
                              className="input-ottoman"
                              value={addressFormData.fullName}
                              onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-ottoman-cream mb-2">
                              Telefon *
                            </label>
                            <input
                              type="tel"
                              className="input-ottoman"
                              value={addressFormData.phone}
                              onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                              placeholder="0555 123 45 67"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-ottoman-cream mb-2">
                              Posta Kodu *
                            </label>
                            <input
                              type="text"
                              className="input-ottoman"
                              value={addressFormData.postalCode}
                              onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-ottoman-cream mb-2">
                            Adres *
                          </label>
                          <textarea
                            className="input-ottoman min-h-[80px]"
                            value={addressFormData.street}
                            onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-ottoman-cream mb-2">
                              İlçe/İl *
                            </label>
                            <input
                              type="text"
                              className="input-ottoman"
                              value={addressFormData.state}
                              onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-ottoman-cream mb-2">
                              Şehir *
                            </label>
                            <input
                              type="text"
                              className="input-ottoman"
                              value={addressFormData.city}
                              onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-ottoman-cream mb-2">
                              Ülke *
                            </label>
                            <input
                              type="text"
                              className="input-ottoman"
                              value={addressFormData.country}
                              onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={addressFormData.isDefault}
                            onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                            className="w-4 h-4 rounded border-white/20 bg-white/10 text-ottoman-gold focus:ring-ottoman-gold"
                          />
                          <label htmlFor="isDefault" className="text-sm text-ottoman-cream cursor-pointer">
                            Varsayılan adres olarak ayarla
                          </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-ottoman flex items-center gap-2"
                          >
                            <Save className="w-5 h-5" />
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddressForm(false)
                              setEditingAddress(null)
                            }}
                            className="btn-ottoman-outline"
                          >
                            İptal
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Address List */}
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
                        <p className="text-ottoman-cream/70">
                          Henüz kayıtlı adresiniz yok
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <motion.div
                            key={address._id}
                            className={`p-4 rounded-lg border transition-all ${
                              address.isDefault
                                ? 'bg-ottoman-gold/10 border-ottoman-gold/30'
                                : 'bg-white/5 border-white/10'
                            }`}
                            layout
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white">
                                  {address.title}
                                </h3>
                                {address.isDefault && (
                                  <span className="flex items-center gap-1 text-xs bg-ottoman-gold/20 text-ottoman-gold px-2 py-0.5 rounded-full">
                                    <Star className="w-3 h-3 fill-current" />
                                    Varsayılan
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="p-1 text-ottoman-cream/60 hover:text-white transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(address._id)}
                                  className="p-1 text-ottoman-cream/60 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-white mb-1">{address.fullName}</p>
                            <p className="text-sm text-ottoman-cream/70 mb-1">{address.phone}</p>
                            <p className="text-sm text-ottoman-cream/70">
                              {address.street}, {address.state} / {address.city}
                            </p>
                            <p className="text-sm text-ottoman-cream/70">
                              {address.postalCode}, {address.country}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
