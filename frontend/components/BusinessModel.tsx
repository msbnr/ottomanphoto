'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Shield, Award } from 'lucide-react'

const tiers = [
  { name: 'Müşteri', discount: '0%', icon: Users, color: 'text-ottoman-cream' },
  { name: 'Küçük Bayi', discount: '10%', icon: TrendingUp, color: 'text-ottoman-gold' },
  { name: 'Orta Bayi', discount: '16%', icon: Award, color: 'text-ottoman-gold-light' },
  { name: 'Büyük Bayi', discount: '20%', icon: Shield, color: 'text-ottoman-gold' },
  { name: 'Ana Bayi', discount: '24%', icon: Award, color: 'text-ottoman-gold-light' },
]

export default function BusinessModel() {
  return (
    <section className="py-20 bg-ottoman-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="header-ottoman mb-4">İş Modelimiz</h2>
          <p className="text-ottoman-cream/70 text-lg max-w-3xl mx-auto">
            5 seviyeli bayi sistemi ile kar marjınızı artırın. Satış hacminize göre daha fazla kazanın!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className="card-ottoman text-center hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-ottoman-gold/20 rounded-full flex items-center justify-center ${tier.color}`}>
                <tier.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-ottoman-cream mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-ottoman-gold mb-2">{tier.discount}</div>
              <p className="text-sm text-ottoman-cream/60">İndirim Oranı</p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-ottoman-gold/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-ottoman-gold" />
            </div>
            <h3 className="text-xl font-semibold text-ottoman-gold mb-3">Güvenli Ödeme</h3>
            <p className="text-ottoman-cream/70">
              SSL sertifikası ile korunan, güvenli ödeme altyapısı. Kredi kartı, havale ve kapıda ödeme seçenekleri.
            </p>
          </motion.div>

          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 bg-ottoman-red/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-ottoman-red-light" />
            </div>
            <h3 className="text-xl font-semibold text-ottoman-red-light mb-3">Yüksek Kar</h3>
            <p className="text-ottoman-cream/70">
              Satış hacminize göre artan indirim oranları ile %24'e varan kar marjı elde edin.
            </p>
          </motion.div>

          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-ottoman-gold/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-ottoman-gold" />
            </div>
            <h3 className="text-xl font-semibold text-ottoman-gold mb-3">Premium Destek</h3>
            <p className="text-ottoman-cream/70">
              7/24 müşteri desteği, özel bayi eğitimleri ve pazarlama materyalleri ile yanınızdayız.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
