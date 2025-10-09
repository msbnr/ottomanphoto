'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, MapPin, Phone, Mail, Check, Send } from 'lucide-react'
import Image from 'next/image'

const concepts = [
  { id: 'concept1', name: 'Mini Market (50-100 m²)', investment: '₺150,000 - ₺250,000' },
  { id: 'concept2', name: 'Standart Mağaza (100-200 m²)', investment: '₺250,000 - ₺400,000' },
  { id: 'concept3', name: 'Büyük Mağaza (200+ m²)', investment: '₺400,000+' },
]

export default function FranchisePage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: 'Türkiye',
    concept: 'concept1',
    experience: '',
    budget: '',
    notes: '',
    termsAccepted: false,
    privacyAccepted: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          className="card-ottoman max-w-2xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-ottoman-gold mb-4">
            Başvurunuz Alındı!
          </h2>
          <p className="text-ottoman-cream/80 mb-6">
            Franchise başvurunuz başarıyla kaydedildi. Değerlendirme sürecimiz tamamlandıktan sonra
            sizinle iletişime geçeceğiz.
          </p>
          <p className="text-sm text-ottoman-cream/60 mb-8">
            Ortalama değerlendirme süresi: <strong className="text-ottoman-gold">3-5 iş günü</strong>
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-ottoman"
          >
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Ottoman Platform"
              width={200}
              height={60}
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-ottoman-gold to-ottoman-gold-light bg-clip-text text-transparent">
              Franchise Başvurusu
            </span>
          </h1>
          <p className="text-xl text-ottoman-cream/80 max-w-3xl mx-auto">
            Ottoman Platform ailesi sizinle büyümek istiyor.
            Kendi işinizin sahibi olun, güçlü bir marka ile başarıya ulaşın.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left: Benefits */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-ottoman sticky top-24">
              <h3 className="text-2xl font-serif font-bold text-ottoman-gold mb-6">
                Franchise Avantajları
              </h3>
              <ul className="space-y-4">
                {[
                  'Yerleşik marka gücü',
                  'Kapsamlı eğitim programı',
                  'Pazarlama desteği',
                  'Özel bayi fiyatlandırması',
                  'Düşük başlangıç maliyeti',
                  'Yüksek kar marjı',
                  '7/24 teknik destek',
                  'Lokasyon analizi',
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-ottoman-cream/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Application Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="card-ottoman space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-xl font-semibold text-ottoman-gold mb-4">
                  Kişisel Bilgiler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      E-posta *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold w-5 h-5" />
                      <input
                        type="email"
                        className="input-ottoman pl-12"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Telefon *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold w-5 h-5" />
                      <input
                        type="tel"
                        className="input-ottoman pl-12"
                        placeholder="+90 5XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Şehir *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold w-5 h-5" />
                      <input
                        type="text"
                        className="input-ottoman pl-12"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="text-xl font-semibold text-ottoman-gold mb-4">
                  İş Bilgileri
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Franchise Konsepti *
                    </label>
                    <select
                      className="input-ottoman"
                      value={formData.concept}
                      onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                    >
                      {concepts.map(concept => (
                        <option key={concept.id} value={concept.id}>
                          {concept.name} - {concept.investment}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      İş Deneyiminiz
                    </label>
                    <textarea
                      className="input-ottoman min-h-[80px]"
                      placeholder="Daha önce iş deneyiminizi kısaca açıklayın..."
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Yatırım Bütçeniz
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      placeholder="₺ 100,000 - ₺ 200,000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Ek Notlar
                    </label>
                    <textarea
                      className="input-ottoman min-h-[100px]"
                      placeholder="Eklemek istediğiniz başka bir şey var mı?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30 bg-ottoman-black-lighter mt-1"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    required
                  />
                  <span className="text-sm text-ottoman-cream/80">
                    <strong className="text-ottoman-gold">Kullanım Şartları</strong>'nı okudum ve kabul ediyorum. *
                  </span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30 bg-ottoman-black-lighter mt-1"
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                    required
                  />
                  <span className="text-sm text-ottoman-cream/80">
                    <strong className="text-ottoman-gold">Gizlilik Politikası</strong>'nı okudum ve kabul ediyorum. *
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-ottoman py-4 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Başvuruyu Gönder</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
