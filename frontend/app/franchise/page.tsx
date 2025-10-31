'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, MapPin, Phone, Mail, Check, Send, X } from 'lucide-react'
import Image from 'next/image'
import { franchiseAPI, settingsAPI } from '@/lib/api'
import { TURKEY_CITIES } from '@/lib/constants'

export default function FranchisePage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [concepts, setConcepts] = useState<any[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [stats, setStats] = useState<any[]>([])
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    concept: '',
    notes: '',
    termsAccepted: false,
    privacyAccepted: false,
  })

  useEffect(() => {
    fetchConcepts()
    fetchFeatures()
    fetchStats()
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showTermsModal || showPrivacyModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showTermsModal, showPrivacyModal])

  const fetchConcepts = async () => {
    try {
      const response = await settingsAPI.getFranchiseConcepts()
      if (response.data.data.concepts) {
        setConcepts(response.data.data.concepts)
        if (response.data.data.concepts.length > 0) {
          setFormData(prev => ({ ...prev, concept: response.data.data.concepts[0].id }))
        }
      }
    } catch (error) {
      console.error('Error fetching concepts:', error)
    }
  }

  const fetchFeatures = async () => {
    try {
      const response = await settingsAPI.getFranchiseFeatures()
      if (response.data.data.features) {
        // Extract only titles for the simple list
        const featureTitles = response.data.data.features.map((f: any) => f.title)
        setFeatures(featureTitles)
      }
    } catch (error) {
      console.error('Error fetching features:', error)
      // Fallback to default features if API fails
      setFeatures([
    'Yerleşik marka gücü ve tanınırlık',
    'Gelişmiş yazılım ile iş takibi',
    'Alt bayi oluşturma imkanı',
    'Fotoğrafçılık Eğitimi',
    'Satış ve Pazarlama Eğitimi',
    'Özel bayi fiyatlandırması',
    'Düşük başlangıç maliyeti',
    'Yüksek kar marjı',
    'Geniş ürün yelpazesi (200+ ürün)',
    'Rekabetçi fiyatlandırma',
    'Düzenli kampanyalar',
    'Kolay sipariş yönetimi',
      ])
    }
  }

  const fetchStats = async () => {
    try {
      const response = await settingsAPI.get()
      if (response.data.data.franchiseStats) {
        setStats(response.data.data.franchiseStats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to default stats if API fails
      setStats([
        { id: 'stat1', label: 'Aktif Bayi', value: '50+', icon: 'Building', order: 1 },
        { id: 'stat2', label: 'Bayi Memnuniyeti', value: '%95', icon: 'ThumbsUp', order: 2 },
        { id: 'stat3', label: 'Ortalama Geri Dönüş', value: '3 Ay', icon: 'TrendingUp', order: 3 },
        { id: 'stat4', label: 'Teknik Destek', value: '24/7', icon: 'Headphones', order: 4 },
      ])
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Sadece rakamlar
    if (value.length <= 11) {
      setFormData({ ...formData, phone: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Telefon validasyonu
    if (formData.phone.length !== 11) {
      setError('Telefon numarası 11 haneli olmalıdır (5XXXXXXXXX)')
      setLoading(false)
      return
    }

    try {
      await franchiseAPI.apply(formData)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Başvuru gönderilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
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
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Başvurunuz Alındı!
          </h2>
          <p className="text-ottoman-cream/80 mb-6">
            Franchise başvurunuz başarıyla kaydedildi. Değerlendirme sürecimiz tamamlandıktan sonra
            sizinle iletişime geçeceğiz.
          </p>
          <p className="text-sm text-ottoman-cream/60 mb-8">
            Ortalama değerlendirme süresi: <strong className="text-white">3-5 iş günü</strong>
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
            <span className="text-white">
              Franchise Başvurusu
            </span>
          </h1>
          <p className="text-xl text-ottoman-cream/80 max-w-3xl mx-auto">
            Ottoman Platform ailesi sizinle büyümek istiyor.
            Kendi işinizin sahibi olun, güçlü bir marka ile başarıya ulaşın.
          </p>
        </motion.div>

        {/* İstatistikler */}
        {stats.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="card-ottoman text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-ottoman-cream/70">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left: Benefits */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-ottoman sticky top-24">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                Franchise İçeriği
              </h3>
              <ul className="space-y-4">
                {features.map((item, index) => (
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
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Personal Info */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
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
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
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
                      Telefon * (11 hane)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                      <input
                        type="tel"
                        className="input-ottoman pl-12"
                        placeholder="05XXXXXXXXX (11 hane)"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        maxLength={11}
                        pattern="[0-9]{11}"
                        required
                      />
                      <span className="text-xs text-ottoman-cream/50 mt-1 block">
                        {formData.phone.length}/11 hane
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Şehir *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
                      <select
                        className="input-ottoman pl-12 appearance-none"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      >
                        <option value="">Şehir seçiniz...</option>
                        {TURKEY_CITIES.map(city => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
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
                      required
                    >
                      {concepts.map(concept => (
                        <option key={concept.id} value={concept.id}>
                          {concept.name}
                        </option>
                      ))}
                    </select>
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
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-white/30 bg-ottoman-black-lighter mt-1 cursor-pointer"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    required
                  />
                  <span className="text-sm text-ottoman-cream/80">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowTermsModal(true)
                      }}
                      className="text-white font-bold hover:text-ottoman-gold transition-colors underline"
                    >
                      Kullanım Şartları
                    </button>
                    &apos;nı okudum ve kabul ediyorum. *
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-white/30 bg-ottoman-black-lighter mt-1 cursor-pointer"
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                    required
                  />
                  <span className="text-sm text-ottoman-cream/80">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowPrivacyModal(true)
                      }}
                      className="text-white font-bold hover:text-ottoman-gold transition-colors underline"
                    >
                      Gizlilik Politikası
                    </button>
                    &apos;nı okudum ve kabul ediyorum. *
                  </span>
                </div>
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

      {/* Terms Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              className="bg-[#0A0A0A] border border-white/10 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-white">Kullanım Şartları</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-white hover:text-ottoman-gold transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-ottoman-cream/90">
                <h3 className="text-xl font-semibold text-white">1. Genel Hükümler</h3>
                <p>
                  Bu Kullanım Şartları, Ottoman Platform franchise başvuru sistemini kullanan tüm kullanıcılar için geçerlidir.
                  Sistemi kullanarak bu şartları kabul etmiş sayılırsınız.
                </p>

                <h3 className="text-xl font-semibold text-white">2. Franchise Başvurusu</h3>
                <p>
                  Franchise başvurusunda bulunarak, sağladığınız bilgilerin doğru ve güncel olduğunu teyit etmiş olursunuz.
                  Yanlış veya yanıltıcı bilgi vermek başvurunuzun reddedilmesine neden olabilir.
                </p>

                <h3 className="text-xl font-semibold text-white">3. Değerlendirme Süreci</h3>
                <p>
                  Başvurunuz alındıktan sonra değerlendirme süreci başlar. Bu süreç ortalama 3-5 iş günü sürmektedir.
                  Başvurunuzun kabul veya reddi konusunda size e-posta yoluyla bilgi verilecektir.
                </p>

                <h3 className="text-xl font-semibold text-white">4. Gizlilik ve Veri Koruma</h3>
                <p>
                  Başvuru sürecinde paylaştığınız tüm bilgiler gizli tutulacak ve sadece franchise değerlendirmesi için kullanılacaktır.
                  Bilgileriniz üçüncü şahıslarla paylaşılmayacaktır.
                </p>

                <h3 className="text-xl font-semibold text-white">5. Sorumluluklar</h3>
                <p>
                  Ottoman Platform, başvuruların kabul veya reddi konusunda tam yetkiye sahiptir.
                  Ret kararları için herhangi bir gerekçe sunma yükümlülüğü bulunmamaktadır.
                </p>

                <h3 className="text-xl font-semibold text-white">6. Değişiklik Hakkı</h3>
                <p>
                  Ottoman Platform, bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar.
                  Güncel şartlar her zaman bu sayfada yayınlanacaktır.
                </p>
              </div>
              <div className="sticky bottom-0 bg-[#0A0A0A] border-t border-white/10 p-6">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="btn-ottoman w-full"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              className="bg-[#0A0A0A] border border-white/10 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-white">Gizlilik Politikası</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-white hover:text-ottoman-gold transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-ottoman-cream/90">
                <h3 className="text-xl font-semibold text-white">1. Toplanan Bilgiler</h3>
                <p>
                  Franchise başvuru sürecinde aşağıdaki bilgiler toplanmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ad Soyad</li>
                  <li>E-posta adresi</li>
                  <li>Telefon numarası</li>
                  <li>Şehir bilgisi</li>
                  <li>İlgilendiğiniz franchise konsepti</li>
                  <li>Ek notlar (opsiyonel)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">2. Bilgilerin Kullanımı</h3>
                <p>
                  Toplanan bilgiler yalnızca aşağıdaki amaçlar için kullanılmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Franchise başvurunuzun değerlendirilmesi</li>
                  <li>Sizinle iletişime geçilmesi</li>
                  <li>Franchise sürecinin yönetimi</li>
                  <li>İstatistiksel analizler (anonim olarak)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">3. Bilgi Güvenliği</h3>
                <p>
                  Kişisel bilgileriniz, endüstri standartlarında güvenlik önlemleri ile korunmaktadır.
                  Verileriniz şifrelenmiş bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır.
                </p>

                <h3 className="text-xl font-semibold text-white">4. Üçüncü Taraf Paylaşımı</h3>
                <p>
                  Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.
                  Franchise değerlendirme sürecinde sadece yetkili Ottoman Platform çalışanları bilgilerinize erişebilir.
                </p>

                <h3 className="text-xl font-semibold text-white">5. Çerezler</h3>
                <p>
                  Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
                  Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.
                </p>

                <h3 className="text-xl font-semibold text-white">6. Haklarınız</h3>
                <p>
                  KVKK kapsamında, kişisel verileriniz hakkında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Bilgilerinize erişim hakkı</li>
                  <li>Düzeltme hakkı</li>
                  <li>Silme hakkı</li>
                  <li>İşleme itiraz hakkı</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">7. İletişim</h3>
                <p>
                  Gizlilik politikamız hakkında sorularınız için info@ottoman.com adresinden bize ulaşabilirsiniz.
                </p>
              </div>
              <div className="sticky bottom-0 bg-[#0A0A0A] border-t border-white/10 p-6">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="btn-ottoman w-full"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
