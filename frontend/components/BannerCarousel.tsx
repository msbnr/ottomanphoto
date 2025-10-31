'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import axios from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

interface Banner {
  _id: string
  title: string
  description?: string
  imageUrl: string
  link?: string
  order: number
  isActive: boolean
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Auto-slide every 5 seconds

    return () => clearInterval(timer)
  }, [banners.length])

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/banners')
      const data = response.data
      if (data.data && Array.isArray(data.data.banners)) {
        setBanners(data.data.banners)
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  if (loading) {
    return (
      <div className="w-full min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-[#0A0A0A] to-[#000000] animate-pulse rounded-lg" />
    )
  }

  if (banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  const BannerContent = () => (
    <div className="relative w-full rounded-lg overflow-hidden bg-[#0A0A0A]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex flex-col md:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Section */}
          <div className="relative w-full md:w-[60%] aspect-[16/10] md:aspect-auto md:min-h-[400px]">
            <img
              src={getImageUrl(currentBanner.imageUrl)}
              alt={currentBanner.title}
              className="w-full h-full object-cover"
            />
            {/* Desktop gradient overlay */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>

          {/* Text Section - Separate from image on mobile */}
          <div className="relative w-full md:w-[40%] bg-gradient-to-b md:bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] p-6 sm:p-8 md:p-10 flex flex-col justify-center min-h-[180px] md:min-h-[400px]">
            {/* Content */}
            <div className="relative z-10">
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 md:mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentBanner.title}
              </motion.h2>

              {currentBanner.description && (
                <motion.p
                  className="text-sm sm:text-base md:text-lg text-ottoman-cream/90 mb-4 md:mb-6 line-clamp-3 md:line-clamp-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentBanner.description}
                </motion.p>
              )}

              {currentBanner.link && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button className="btn-ottoman text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3">
                    Detayları Gör
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Positioned on image area */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 sm:left-4 top-[20%] md:top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all z-20 shadow-xl"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 sm:right-4 top-[20%] md:top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all z-20 shadow-xl"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator - On image for mobile, bottom center for desktop */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 md:left-[30%] -translate-x-1/2 flex space-x-2 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-ottoman-cream w-8 h-2.5'
                  : 'bg-white/60 hover:bg-white/80 w-2.5 h-2.5'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )

  // If banner has a link, wrap in Link component
  if (currentBanner.link) {
    return (
      <Link href={currentBanner.link}>
        <BannerContent />
      </Link>
    )
  }

  return <BannerContent />
}
