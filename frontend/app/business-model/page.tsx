'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Award, DollarSign, Shield, GraduationCap, Computer, Check } from 'lucide-react'
import Link from 'next/link'
import { settingsAPI } from '@/lib/api'

// Icon mapping
const iconMap: { [key: string]: any } = {
  Award,
  GraduationCap,
  Computer,
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  Check,
}

export default function BusinessModelPage() {
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await settingsAPI.getFranchiseFeatures()
      if (response.data.data.features) {
        setFeatures(response.data.data.features)
      }
    } catch (error) {
      console.error('Error fetching features:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="header-ottoman mb-4">İş Modeli</h1>
          <p className="text-xl text-ottoman-cream/70 max-w-3xl mx-auto">
            4 seviyeli bayi sistemi ile her büyüklükteki işletmeye özel fiyatlandırma ve destek
          </p>
        </motion.div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          {[ 
            { name: 'Küçük Bayi', discount: '10%', icon: TrendingUp, description: 'Aylık 50K+ ciro' },
            { name: 'Orta Bayi', discount: '16%', icon: Award, description: 'Aylık 100K+ ciro' },
            { name: 'Büyük Bayi', discount: '20%', icon: Shield, description: 'Aylık 250K+ ciro' },
            { name: 'Ana Bayi', discount: '24%', icon: DollarSign, description: 'Aylık 500K+ ciro' },
          ].map((tier, index) => (
            <motion.div
              key={tier.name}
              className="card-ottoman text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <tier.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-ottoman-cream mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-white mb-2">{tier.discount}</div>
              <p className="text-sm text-ottoman-cream/60">{tier.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Franchise Features */}
        {!loading && features.length > 0 && (
          <div className="mb-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Franchise Avantajları
              </h2>
              <p className="text-lg text-ottoman-cream/70 max-w-2xl mx-auto">
                Ottoman Platform franchise sistemi ile işinizi büyütün
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Check
                return (
                  <motion.div
                    key={feature.id}
                    className="card-ottoman text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-ottoman-cream/70">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif font-bold text-white mb-4">
              Neden Ottoman Platform?
            </h3>
            <ul className="space-y-3 text-ottoman-cream/80">
			
			<li>✓ Gelişmiş yazılım ile iş takibi</li>
			<li>✓ Güvenilir marka gücü</li>
			<li>✓ Fotoğrafçılık Eğitimi</li>
			<li>✓ Satış ve Pazarlama Eğitimi</li>
			<li>✓ Özel bayi fiyatlandırması</li>
			<li>✓ Düşük başlangıç maliyeti</li>
			<li>✓ Yüksek kar marjı</li>
            <li>✓ Geniş ürün yelpazesi (500+ ürün)</li>
            <li>✓ Rekabetçi fiyatlandırma</li>  
            <li>✓ Düzenli kampanyalar</li>
            <li>✓ Kolay sipariş yönetimi</li>
            </ul>
          </motion.div>

          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif font-bold text-white mb-4">
              Bayi Olmak İçin
            </h3>
            <p className="text-ottoman-cream/80 mb-4">
              Ottoman Platform bayisi olarak işinizi büyütün, karlılığınızı artırın.
            </p>
            <Link href="/franchise" className="btn-ottoman w-full block text-center">
              Hemen Başvur
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
