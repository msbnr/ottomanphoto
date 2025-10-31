'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Error Icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-32 h-32 bg-red-500/10 border-2 border-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Bir Şeyler Yanlış Gitti
            </h1>
            <p className="text-xl text-ottoman-cream/70 mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <motion.div
                className="card-ottoman text-left mb-6 bg-red-500/5 border-red-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-red-400 font-semibold mb-2">Hata Detayları (Geliştirici Modu):</h3>
                <p className="text-sm text-red-300/80 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-300/60 mt-2">
                    Error Digest: {error.digest}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={reset}
              className="btn-ottoman flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Tekrar Dene
            </button>

            <Link
              href="/"
              className="btn-ottoman-outline flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </motion.div>

          {/* Help Section */}
          <motion.div
            className="card-ottoman bg-white/5 border-white/10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Sorun Devam Ediyor mu?
            </h3>
            <p className="text-ottoman-cream/70 mb-4">
              Eğer hata devam ederse, lütfen müşteri hizmetlerimizle iletişime geçin.
            </p>
            <Link
              href="/contact"
              className="btn-ottoman-secondary inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              İletişime Geç
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="mt-12 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-red-500/30 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
