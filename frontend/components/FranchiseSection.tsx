'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

const benefits = [
  'Yerleşik marka gücü ve tanınırlık',
  'Kapsamlı eğitim ve destek programı',
  'Pazarlama ve reklam desteği',
  'Özel bayi fiyatlandırması',
  'Düşük başlangıç maliyeti',
  'Yüksek kar marjı fırsatı',
]

export default function FranchiseSection() {
  return (
    <section className="py-20 bg-ottoman-black-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              <span className="text-ottoman-gold">Franchise</span>
              <br />
              <span className="text-ottoman-cream">Olun</span>
            </h2>
            <p className="text-xl text-ottoman-cream/80 mb-8">
              Ottoman Platform bayisi olarak, güçlü bir marka ile kendi işinizi kurun.
              Kanıtlanmış iş modeli ve kapsamlı destekle başarıya ulaşın.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="w-6 h-6 text-ottoman-gold flex-shrink-0 mt-1" />
                  <span className="text-ottoman-cream/80">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/franchise" className="btn-ottoman">
              Başvuru Yap
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>
          </motion.div>

          {/* Right Content - Stats Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-ottoman p-8">
              <h3 className="text-2xl font-serif font-bold text-ottoman-gold mb-6">
                Franchise İstatistikleri
              </h3>

              <div className="space-y-6">
                <div className="border-l-4 border-ottoman-gold pl-4">
                  <div className="text-4xl font-bold text-ottoman-gold mb-1">50+</div>
                  <div className="text-ottoman-cream/70">Aktif Bayi</div>
                </div>

                <div className="border-l-4 border-ottoman-red pl-4">
                  <div className="text-4xl font-bold text-ottoman-red-light mb-1">%95</div>
                  <div className="text-ottoman-cream/70">Bayi Memnuniyeti</div>
                </div>

                <div className="border-l-4 border-ottoman-gold pl-4">
                  <div className="text-4xl font-bold text-ottoman-gold mb-1">3 Ay</div>
                  <div className="text-ottoman-cream/70">Ortalama Geri Dönüş</div>
                </div>

                <div className="border-l-4 border-ottoman-red pl-4">
                  <div className="text-4xl font-bold text-ottoman-red-light mb-1">24/7</div>
                  <div className="text-ottoman-cream/70">Teknik Destek</div>
                </div>
              </div>

              <div className="divider-ottoman"></div>

              <div className="bg-ottoman-gold/10 border border-ottoman-gold/30 rounded-lg p-4">
                <p className="text-sm text-ottoman-cream/80 mb-2">
                  💼 <span className="font-semibold text-ottoman-gold">Özel Teklif:</span>
                </p>
                <p className="text-sm text-ottoman-cream/70">
                  İlk 10 başvuruya özel başlangıç paketi indirimi ve ücretsiz ilk yıl pazarlama desteği!
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 bg-ottoman-gold/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-ottoman-red/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
