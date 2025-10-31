'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, User, Phone, Building, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [userType, setUserType] = useState<'customer' | 'dealer'>('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    companyName: '',
    taxNumber: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement actual registration with API
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold text-white mb-2">
                Kayıt Olun
              </h1>
              <p className="text-ottoman-cream/70">
                Ottoman Platform&apos;a katılın ve avantajlardan yararlanın
              </p>
            </div>

            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  userType === 'customer'
                    ? 'bg-white/10 border-white'
                    : 'bg-ottoman-black-lighter border-white/20 hover:border-white/40'
                }`}
              >
                <User className="w-8 h-8 text-white mx-auto mb-2" />
                <h3 className="font-semibold text-ottoman-cream mb-1">Müşteri</h3>
                <p className="text-sm text-ottoman-cream/70">Bireysel alışveriş</p>
              </button>

              <button
                type="button"
                onClick={() => setUserType('dealer')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  userType === 'dealer'
                    ? 'bg-white/10 border-white'
                    : 'bg-ottoman-black-lighter border-white/20 hover:border-white/40'
                }`}
              >
                <Building className="w-8 h-8 text-white mx-auto mb-2" />
                <h3 className="font-semibold text-ottoman-cream mb-1">Bayi</h3>
                <p className="text-sm text-ottoman-cream/70">Toplu alım, özel fiyat</p>
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="card-ottoman space-y-6">
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
                  En az 6 karakter, bir büyük harf ve bir rakam içermelidir
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  {userType === 'dealer' ? 'Yetkili Adı Soyadı' : 'Ad Soyad'} *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Adınız Soyadınız"
                    className="input-ottoman pl-12"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Telefon *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="+90 5XX XXX XX XX"
                    className="input-ottoman pl-12"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Dealer Specific Fields */}
              {userType === 'dealer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Firma Adı *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Firma Ünvanı"
                        className="input-ottoman pl-12"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Vergi Numarası *
                    </label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      className="input-ottoman"
                      value={formData.taxNumber}
                      onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="bg-white/10 border border-white/30 rounded-lg p-4">
                    <p className="text-sm text-ottoman-cream/80">
                      <strong className="text-white">Bayi Avantajları:</strong>
                      <br />• %10 - %24 arası özel fiyatlandırma
                      <br />• Özel bayi ürünlerine erişim
                      <br />• Toplu sipariş kolaylığı
                      <br />• Özel destek hattı
                    </p>
                  </div>
                </>
              )}

              {/* Terms */}
              <div className="space-y-3">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-2 border-white/30 rounded bg-ottoman-black-lighter mt-1"
                    required
                  />
                  <span className="text-sm text-ottoman-cream/70">
                    <Link href="/terms" className="text-white hover:text-white-light">
                      Kullanım Şartları
                    </Link>
                    &apos;nı ve{' '}
                    <Link href="/privacy" className="text-white hover:text-white-light">
                      Gizlilik Politikası
                    </Link>
                    &apos;nı okudum, kabul ediyorum.
                  </span>
                </label>

                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-2 border-white/30 rounded bg-ottoman-black-lighter mt-1"
                  />
                  <span className="text-sm text-ottoman-cream/70">
                    Kampanya ve duyurulardan haberdar olmak istiyorum.
                  </span>
                </label>
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
                    Kayıt yapılıyor...
                  </span>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-ottoman-cream/70">
                Zaten hesabınız var mı?{' '}
                <Link href="/login" className="text-white hover:text-white-light font-semibold">
                  Giriş Yapın
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
