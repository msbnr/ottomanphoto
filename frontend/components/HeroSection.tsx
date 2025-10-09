'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, TrendingUp } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 border-2 border-ottoman-gold rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 border-2 border-ottoman-red rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-ottoman-gold/10 border border-ottoman-gold/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-4 h-4 text-ottoman-gold fill-ottoman-gold" />
              <span className="text-sm font-semibold text-ottoman-gold">Premium Kalite</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ottoman-gold via-ottoman-gold-light to-ottoman-gold animate-shimmer">
                Ottoman
              </span>
              <br />
              <span className="text-ottoman-cream">Platform</span>
            </h1>

            <p className="text-xl md:text-2xl text-ottoman-cream/80 mb-8 leading-relaxed">
              Tarihi değerleri modern iş dünyasıyla buluşturan,
              <span className="text-ottoman-gold font-semibold"> kaliteli ofis ürünleri</span> ve
              <span className="text-ottoman-gold font-semibold"> franchise çözümleri</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/products" className="btn-ottoman">
                Ürünleri İncele
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </Link>
              <Link href="/franchise" className="btn-ottoman-outline">
                Franchise Ol
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-ottoman-gold mb-1">500+</div>
                <div className="text-sm text-ottoman-cream/60">Ürün Çeşidi</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-3xl font-bold text-ottoman-gold mb-1">50+</div>
                <div className="text-sm text-ottoman-cream/60">Bayi Ağı</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-3xl font-bold text-ottoman-gold mb-1">24/7</div>
                <div className="text-sm text-ottoman-cream/60">Destek</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="card-ottoman hover:scale-105 transition-transform"
              whileHover={{ y: -10 }}
            >
              <div className="w-12 h-12 bg-ottoman-gold/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-ottoman-gold" />
              </div>
              <h3 className="text-xl font-semibold text-ottoman-gold mb-2">Güvenilir</h3>
              <p className="text-ottoman-cream/70 text-sm">
                Tüm ürünlerde garanti ve satış sonrası destek
              </p>
            </motion.div>

            <motion.div
              className="card-ottoman hover:scale-105 transition-transform sm:mt-12"
              whileHover={{ y: -10 }}
            >
              <div className="w-12 h-12 bg-ottoman-red/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-ottoman-red-light" />
              </div>
              <h3 className="text-xl font-semibold text-ottoman-red-light mb-2">Karlı</h3>
              <p className="text-ottoman-cream/70 text-sm">
                5 seviyeli bayi fiyatlandırması ile yüksek kar marjı
              </p>
            </motion.div>

            <motion.div
              className="card-ottoman hover:scale-105 transition-transform"
              whileHover={{ y: -10 }}
            >
              <div className="w-12 h-12 bg-ottoman-gold/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-ottoman-gold fill-ottoman-gold" />
              </div>
              <h3 className="text-xl font-semibold text-ottoman-gold mb-2">Kaliteli</h3>
              <p className="text-ottoman-cream/70 text-sm">
                Seçilmiş markalar ve premium ürün kalitesi
              </p>
            </motion.div>

            <motion.div
              className="card-ottoman hover:scale-105 transition-transform sm:mt-12"
              whileHover={{ y: -10 }}
            >
              <div className="w-12 h-12 bg-ottoman-red/20 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-ottoman-red-light" />
              </div>
              <h3 className="text-xl font-semibold text-ottoman-red-light mb-2">Hızlı</h3>
              <p className="text-ottoman-cream/70 text-sm">
                Türkiye geneli hızlı kargo ve teslimat
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 opacity-50">
        <svg viewBox="0 0 1440 120" className="w-full h-24" fill="none">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="url(#wave-gradient)" />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0F0F0F" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  )
}
