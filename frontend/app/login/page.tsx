'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement actual login with API
    setTimeout(() => {
      setLoading(false)
    }, 1500)
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
              <h1 className="text-3xl font-serif font-bold text-ottoman-gold mb-2">
                Hoş Geldiniz
              </h1>
              <p className="text-ottoman-cream/70">
                Hesabınıza giriş yaparak alışverişe başlayın
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="card-ottoman space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold w-5 h-5" />
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-ottoman pl-12 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold hover:text-ottoman-gold-light"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-2 border-ottoman-gold/30 rounded bg-ottoman-black-lighter"
                  />
                  <span className="text-sm text-ottoman-cream/70">Beni Hatırla</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-ottoman-gold hover:text-ottoman-gold-light">
                  Şifremi Unuttum
                </Link>
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
                    Giriş yapılıyor...
                  </span>
                ) : (
                  <>
                    Giriş Yap
                    <LogIn className="inline ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-ottoman-cream/70">
                Hesabınız yok mu?{' '}
                <Link href="/register" className="text-ottoman-gold hover:text-ottoman-gold-light font-semibold">
                  Kayıt Olun
                </Link>
              </p>
            </div>

            {/* Test Credentials */}
            <div className="mt-8 card-ottoman bg-ottoman-gold/5">
              <h4 className="text-sm font-semibold text-ottoman-gold mb-2">Test Hesapları:</h4>
              <div className="space-y-2 text-xs text-ottoman-cream/70">
                <div>
                  <strong className="text-ottoman-cream">Admin:</strong> admin@ottoman.com / admin123
                </div>
                <div>
                  <strong className="text-ottoman-cream">Müşteri:</strong> customer@test.com / 123456
                </div>
                <div>
                  <strong className="text-ottoman-cream">Bayi:</strong> dealer@test.com / 123456
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
