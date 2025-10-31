'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error caught:', error)
  }, [error])

  return (
    <html lang="tr">
      <body className="bg-gradient-to-br from-[#1a0000] via-[#000000] to-[#001a00]">
        <div className="min-h-screen flex items-center justify-center py-20 px-4">
          <motion.div
            className="max-w-2xl mx-auto text-center"
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
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                Kritik Bir Hata Oluştu
              </h1>
              <p className="text-xl text-gray-400 mb-6">
                Uygulama beklenmeyen bir hatayla karşılaştı. Lütfen sayfayı yenileyin.
              </p>

              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                  <h3 className="text-red-400 font-semibold mb-2">Hata Detayları:</h3>
                  <p className="text-sm text-red-300/80 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-300/60 mt-2">
                      Digest: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={reset}
                className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/50 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Sayfayı Yenile
              </button>

              <a
                href="/"
                className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Ana Sayfaya Git
              </a>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="mt-12 flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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
      </body>
    </html>
  )
}
