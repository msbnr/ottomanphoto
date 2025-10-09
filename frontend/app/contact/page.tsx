'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
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
          className="card-ottoman max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-ottoman-gold mb-4">
            Mesajınız Gönderildi!
          </h2>
          <p className="text-ottoman-cream/80 mb-6">
            En kısa sürede size geri dönüş yapacağız.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-ottoman"
          >
            Yeni Mesaj Gönder
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="header-ottoman mb-4">İletişim</h1>
          <p className="text-xl text-ottoman-cream/70 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bize ulaşın
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="card-ottoman">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-ottoman-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-ottoman-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ottoman-cream mb-2">Adres</h3>
                  <p className="text-ottoman-cream/70">
                    İstanbul, Türkiye
                  </p>
                </div>
              </div>
            </div>

            <div className="card-ottoman">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-ottoman-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-ottoman-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ottoman-cream mb-2">Telefon</h3>
                  <p className="text-ottoman-cream/70">
                    +90 (555) 123 45 67
                  </p>
                </div>
              </div>
            </div>

            <div className="card-ottoman">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-ottoman-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-ottoman-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ottoman-cream mb-2">E-posta</h3>
                  <p className="text-ottoman-cream/70">
                    info@ottoman.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="card-ottoman space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    className="input-ottoman"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    className="input-ottoman"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Mesajınız *
                </label>
                <textarea
                  className="input-ottoman min-h-[150px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-ottoman py-3 flex items-center justify-center space-x-2"
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
                    <span>Gönder</span>
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
