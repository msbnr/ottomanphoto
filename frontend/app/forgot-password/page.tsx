'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import axios from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err: any) {
      console.error('Forgot password error:', err)
      setError(
        err.response?.data?.message ||
        'Bir hata oluştu. Lütfen tekrar deneyin.'
      )
    } finally {
      setLoading(false)
    }
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
                E-posta Gönderildi!
              </h1>

              <p className="text-ottoman-cream/80 mb-6">
                Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
                Lütfen e-postanızı kontrol edin.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-ottoman-cream/70">
                  <strong>Not:</strong> E-posta gelmedi mi? Spam/gereksiz klasörünüzü kontrol edin.
                  Bağlantı 1 saat içinde geçerliliğini yitirecektir.
                </p>
              </div>

              <Link
                href="/login"
                className="btn-ottoman-outline inline-flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Giriş Sayfasına Dön</span>
              </Link>
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
                Şifremi Unuttum
              </h1>
              <p className="text-ottoman-cream/70">
                E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card-ottoman space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="email"
                    placeholder="ornek@email.com"
                    className="input-ottoman pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                    Gönderiliyor...
                  </span>
                ) : (
                  'Şifre Sıfırlama Bağlantısı Gönder'
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-ottoman-cream/70 hover:text-white inline-flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Giriş sayfasına dön</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
