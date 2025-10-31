'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import axios from '@/lib/api'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Geçersiz şifre sıfırlama bağlantısı')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (!token) {
      setError('Token bulunamadı')
      return
    }

    setLoading(true)

    try {
      await axios.post(`/auth/reset-password/${token}`, { password })
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      console.error('Reset password error:', err)
      setError(
        err.response?.data?.message ||
        'Şifre sıfırlama başarısız. Token geçersiz veya süresi dolmuş olabilir.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-ottoman text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-red-500/20 p-4 rounded-full">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
              </div>

              <h1 className="text-2xl font-serif font-bold text-white mb-4">
                Geçersiz Bağlantı
              </h1>

              <p className="text-ottoman-cream/80 mb-6">
                Şifre sıfırlama bağlantısı geçersiz. Lütfen yeni bir şifre sıfırlama talebi oluşturun.
              </p>

              <Link href="/forgot-password" className="btn-ottoman">
                Şifre Sıfırlama Talebi Oluştur
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-ottoman text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-green-500/20 p-4 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
              </div>

              <h1 className="text-2xl font-serif font-bold text-white mb-4">
                Şifre Başarıyla Sıfırlandı!
              </h1>

              <p className="text-ottoman-cream/80 mb-6">
                Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.
              </p>

              <p className="text-sm text-ottoman-cream/60">
                Giriş sayfasına yönlendiriliyorsunuz...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
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
                Yeni Şifre Belirle
              </h1>
              <p className="text-ottoman-cream/70">
                Hesabınız için yeni bir şifre oluşturun
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card-ottoman space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-ottoman pl-12 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-white-light"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-ottoman-cream/50 mt-1">
                  En az 6 karakter olmalıdır
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Şifre Tekrarı
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-ottoman pl-12 pr-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-white-light"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-ottoman py-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Şifre Sıfırlanıyor...
                  </span>
                ) : (
                  'Şifreyi Sıfırla'
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-ottoman-cream/70 hover:text-white"
              >
                Giriş sayfasına dön
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ottoman-cream/60">Yükleniyor...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
