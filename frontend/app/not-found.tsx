'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, Package, Phone, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 404 Number */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-[150px] md:text-[200px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-ottoman-gold via-ottoman-red to-ottoman-gold leading-none">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Sayfa Bulunamadı
            </h2>
            <p className="text-xl text-ottoman-cream/70 max-w-2xl mx-auto">
              Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
              Endişelenmeyin, size yardımcı olabiliriz.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/"
              className="card-ottoman group hover:border-ottoman-gold/50 transition-all"
            >
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-12 h-12 bg-ottoman-gold/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Home className="w-6 h-6 text-ottoman-gold" />
                </div>
                <span className="text-white font-semibold">Ana Sayfa</span>
              </div>
            </Link>

            <Link
              href="/products"
              className="card-ottoman group hover:border-ottoman-gold/50 transition-all"
            >
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-12 h-12 bg-ottoman-gold/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-ottoman-gold" />
                </div>
                <span className="text-white font-semibold">Ürünler</span>
              </div>
            </Link>

            <Link
              href="/orders"
              className="card-ottoman group hover:border-ottoman-gold/50 transition-all"
            >
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-12 h-12 bg-ottoman-gold/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-ottoman-gold" />
                </div>
                <span className="text-white font-semibold">Siparişlerim</span>
              </div>
            </Link>

            <Link
              href="/contact"
              className="card-ottoman group hover:border-ottoman-gold/50 transition-all"
            >
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-12 h-12 bg-ottoman-gold/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-ottoman-gold" />
                </div>
                <span className="text-white font-semibold">İletişim</span>
              </div>
            </Link>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => window.history.back()}
              className="btn-ottoman-outline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Geri Dön
            </button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="mt-16 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-ottoman-gold/30 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
