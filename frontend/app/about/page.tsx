'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Award, Target, Users, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="header-ottoman mb-4">Hakkımızda</h1>
          <p className="text-xl text-ottoman-cream/70 max-w-3xl mx-auto">
            Tarihi değerleri modern iş dünyasıyla buluşturan Ottoman Platform hikayesi
          </p>
        </motion.div>

        {/* Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-ottoman-cream/80 leading-relaxed mb-4">
                Ottoman Platform, Türkiye&apos;nin önde gelen ofis ürünleri ve iş ekipmanları tedarikçisidir.
                2024 yılında kurulan şirketimiz, kaliteli ürünleri uygun fiyatlarla müşterilerimize ulaştırma
                misyonuyla yola çıktı.
              </p>
              <p className="text-lg text-ottoman-cream/80 leading-relaxed">
                Bugün 500&apos;den fazla ürün çeşidi, 50&apos;yi aşkın bayi ağı ve binlerce memnun müşterisiyle
                sektörde güvenilir bir marka haline geldik. Müşteri memnuniyeti odaklı hizmet anlayışımız
                ve rekabetçi fiyat politikamızla büyümeye devam ediyoruz.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              icon: Award,
              title: 'Kalite',
              description: 'En yüksek kalite standartlarında ürünler'
            },
            {
              icon: Target,
              title: 'Hedef Odaklı',
              description: 'Müşteri memnuniyeti bizim için her şeyden önemli'
            },
            {
              icon: Users,
              title: 'Güvenilir',
              description: 'Binlerce müşterimizin güveni'
            },
            {
              icon: Heart,
              title: 'Müşteri Odaklı',
              description: '7/24 destek ve hızlı çözüm'
            }
          ].map((value, index) => (
            <motion.div
              key={value.title}
              className="card-ottoman text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-ottoman-cream/70">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="card-ottoman"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-ottoman-cream/70">Ürün Çeşidi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-ottoman-cream/70">Bayi Ağı</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-ottoman-cream/70">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-ottoman-cream/70">Destek</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
