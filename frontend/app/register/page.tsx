'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.registerCustomer(formData)
      const { user, token } = response.data.data

      // Save auth state
      setAuth(user, token)

      // Redirect to home
      window.location.href = '/'
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(
        err.response?.data?.message ||
        'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image
                  src="/logo.png"
                  alt="Ottoman Platform"
                  width={200}
                  height={60}
                  className="h-14 w-auto object-contain"
                />
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mb-2">
                Kayıt Olun
              </h1>
              <p className="text-ottoman-cream/70">
                Ottoman Platform'a katılın ve alışverişe başlayın
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="card-ottoman space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Ad *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Adınız"
                    className="input-ottoman pl-12"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Soyad *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Soyadınız"
                    className="input-ottoman pl-12"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  E-posta *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="email"
                    placeholder="ornek@email.com"
                    className="input-ottoman pl-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Telefon (Opsiyonel)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="05XXXXXXXXX"
                    className="input-ottoman pl-12"
                    value={formData.phone}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, '')
                      const limited = numbersOnly.slice(0, 11)
                      setFormData({ ...formData, phone: limited })
                    }}
                    maxLength={11}
                    pattern="[0-9]{11}"
                  />
                </div>
                {formData.phone && (
                  <p className="text-xs text-ottoman-cream/50 mt-1">
                    {formData.phone.length}/11 rakam
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Şifre *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-ottoman pl-12 pr-12"
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
                <p className="mt-1 text-xs text-ottoman-cream/60">En az 6 karakter olmalı</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-ottoman w-full"
              >
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-ottoman-cream/70">
                Zaten hesabınız var mı?{' '}
                <Link href="/login" className="text-white hover:text-ottoman-cream font-medium">
                  Giriş Yapın
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
