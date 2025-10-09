'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Award, DollarSign, Shield } from 'lucide-react'

export default function BusinessModelPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="header-ottoman mb-4">İş Modelimiz</h1>
          <p className="text-xl text-ottoman-cream/70 max-w-3xl mx-auto">
            5 seviyeli bayi sistemi ile her büyüklükteki işletmeye özel fiyatlandırma ve destek
          </p>
        </motion.div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-20">
          {[
            { name: 'Müşteri', discount: '0%', icon: Users, description: 'Perakende satış' },
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
              <div className="w-16 h-16 mx-auto mb-4 bg-ottoman-gold/20 rounded-full flex items-center justify-center">
                <tier.icon className="w-8 h-8 text-ottoman-gold" />
              </div>
              <h3 className="text-lg font-semibold text-ottoman-cream mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-ottoman-gold mb-2">{tier.discount}</div>
              <p className="text-sm text-ottoman-cream/60">{tier.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif font-bold text-ottoman-gold mb-4">
              Neden Ottoman Platform?
            </h3>
            <ul className="space-y-3 text-ottoman-cream/80">
              <li>✓ Geniş ürün yelpazesi (500+ ürün)</li>
              <li>✓ Rekabetçi fiyatlandırma</li>
              <li>✓ Hızlı teslimat</li>
              <li>✓ 7/24 müşteri desteği</li>
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
            <h3 className="text-2xl font-serif font-bold text-ottoman-gold mb-4">
              Bayi Olmak İçin
            </h3>
            <p className="text-ottoman-cream/80 mb-4">
              Ottoman Platform bayisi olarak işinizi büyütün, karlılığınızı artırın.
            </p>
            <button className="btn-ottoman w-full">
              Hemen Başvur
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
