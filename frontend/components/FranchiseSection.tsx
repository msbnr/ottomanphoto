'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { settingsAPI } from '@/lib/api'

const benefits = [
  
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
  
  
]

interface FranchiseStat {
  id: string
  label: string
  value: string
  icon: string
  order: number
}

export default function FranchiseSection() {
  const [stats, setStats] = useState<FranchiseStat[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await settingsAPI.get()
      if (response.data.data.franchiseStats) {
        const sortedStats = response.data.data.franchiseStats.sort((a: FranchiseStat, b: FranchiseStat) => a.order - b.order)
        setStats(sortedStats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to default stats
      setStats([
        { id: 'stat1', label: 'Aktif Bayi', value: '50+', icon: 'Building', order: 1 },
        { id: 'stat2', label: 'Bayi Memnuniyeti', value: '%95', icon: 'ThumbsUp', order: 2 },
        { id: 'stat3', label: 'Ortalama Geri Dönüş', value: '3 Ay', icon: 'TrendingUp', order: 3 },
        { id: 'stat4', label: 'Teknik Destek', value: '24/7', icon: 'Headphones', order: 4 },
      ])
    }
  }
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
              <span className="text-white">Franchise</span>
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
                  <CheckCircle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
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
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                Franchise İstatistikleri
              </h3>

              {stats.length > 0 ? (
                <div className="space-y-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      className={`border-l-4 pl-4 ${
                        index % 2 === 0 ? 'border-white' : 'border-ottoman-red'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`text-4xl font-bold mb-1 ${
                        index % 2 === 0 ? 'text-white' : 'text-ottoman-red-light'
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-ottoman-cream/70">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-ottoman-cream/50 py-8">
                  Yükleniyor...
                </div>
              )}

           
 
        
  
              
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"
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
