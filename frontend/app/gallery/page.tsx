'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Video, X, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { galleryAPI, albumAPI } from '@/lib/api'

interface Album {
  _id: string
  name: string
  description?: string
  coverImage?: string
  isActive: boolean
}

interface GalleryItem {
  _id: string
  type: 'image' | 'video'
  title: string
  description?: string
  imageUrl?: string
  videoUrl?: string
  videoPlatform?: 'youtube' | 'youtube-shorts' | 'instagram'
  thumbnail?: string
  album?: Album | null
  order: number
  isActive: boolean
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchGalleryItems()
    fetchAlbums()
  }, [])

  // Keyboard navigation for gallery lightbox
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedItem) return

      // Filter items based on current filter
      const currentFilteredItems = items.filter(item => {
        if (filter === 'all') return true
        return item.album?._id === filter
      })

      const currentIndex = currentFilteredItems.findIndex(item => item._id === selectedItem._id)

      if (e.key === 'ArrowLeft') {
        // Navigate to previous item
        if (currentIndex > 0) {
          setSelectedItem(currentFilteredItems[currentIndex - 1])
        }
      } else if (e.key === 'ArrowRight') {
        // Navigate to next item
        if (currentIndex < currentFilteredItems.length - 1) {
          setSelectedItem(currentFilteredItems[currentIndex + 1])
        }
      } else if (e.key === 'Escape') {
        // Close modal
        setSelectedItem(null)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedItem, items, filter])

  const fetchAlbums = async () => {
    try {
      const response = await albumAPI.getAll()
      if (response.data.data.albums) {
        setAlbums(response.data.data.albums)
      }
    } catch (error) {
      console.error('Error fetching albums:', error)
    }
  }

  const fetchGalleryItems = async () => {
    try {
      const response = await galleryAPI.getAll()
      if (response.data.data.items) {
        setItems(response.data.data.items)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true
    return item.album?._id === filter
  })

  const getVideoEmbedUrl = (url: string, platform?: string) => {
    if (platform === 'youtube' || !platform) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : url
    } else if (platform === 'youtube-shorts') {
      // Extract video ID from various YouTube Shorts URL formats
      let videoId = url.match(/shorts\/([A-Za-z0-9_-]{11})/)?.[1]

      // If not found, try extracting any 11-character ID after /shorts/
      if (!videoId) {
        videoId = url.match(/shorts\/([A-Za-z0-9_-]+)/)?.[1]?.substring(0, 11)
      }

      // If still not found, try extracting from query parameter
      if (!videoId) {
        videoId = url.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1]
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url
    } else if (platform === 'instagram') {
      // Instagram embed - extract reel ID
      const reelId = url.match(/reel\/([^"&?\/\s]+)/)?.[1]
      return reelId ? `https://www.instagram.com/reel/${reelId}/embed` : url
    }
    return url
  }

  const getYouTubeThumbnail = (url: string, platform?: string) => {
    if (platform === 'youtube-shorts') {
      // Use same improved regex as embed function
      let videoId = url.match(/shorts\/([A-Za-z0-9_-]{11})/)?.[1]

      if (!videoId) {
        videoId = url.match(/shorts\/([A-Za-z0-9_-]+)/)?.[1]?.substring(0, 11)
      }

      if (!videoId) {
        videoId = url.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1]
      }

      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder-video.jpg'
    }
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder-video.jpg'
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'

  // Navigation functions for lightbox
  const goToPrevious = () => {
    if (!selectedItem) return
    const currentIndex = filteredItems.findIndex(item => item._id === selectedItem._id)
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1])
    }
  }

  const goToNext = () => {
    if (!selectedItem) return
    const currentIndex = filteredItems.findIndex(item => item._id === selectedItem._id)
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1])
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="header-ottoman mb-4">Galeri</h1>
          <p className="text-xl text-ottoman-cream/70 max-w-3xl mx-auto">
            Çalışmalarımızdan fotoğraflar ve videolar
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Tümü
          </button>
          {albums.map(album => (
            <button
              key={album._id}
              onClick={() => setFilter(album._id)}
              className={`px-6 py-3 rounded-lg transition-all ${
                filter === album._id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {album.name}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-ottoman-cream/50">Henüz içerik eklenmemiş</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-black"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'image' ? (
                  <img
                    src={`${baseUrl}${item.imageUrl}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={item.thumbnail || getYouTubeThumbnail(item.videoUrl!, item.videoPlatform)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-white/80 text-sm mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                    {item.type === 'image' ? (
                      <ImageIcon className="w-5 h-5 text-white" />
                    ) : (
                      <Video className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white hover:text-ottoman-gold transition-colors z-50"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Previous button */}
              {filteredItems.findIndex(item => item._id === selectedItem._id) > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-ottoman-gold transition-colors z-50 bg-black/50 hover:bg-black/70 rounded-full p-3"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}

              {/* Next button */}
              {filteredItems.findIndex(item => item._id === selectedItem._id) < filteredItems.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-ottoman-gold transition-colors z-50 bg-black/50 hover:bg-black/70 rounded-full p-3"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}

              <motion.div
                className="max-w-6xl w-full"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                {selectedItem.type === 'image' ? (
                  <img
                    src={`${baseUrl}${selectedItem.imageUrl}`}
                    alt={selectedItem.title}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="aspect-video w-full">
                    <iframe
                      src={getVideoEmbedUrl(selectedItem.videoUrl!, selectedItem.videoPlatform)}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-serif font-bold text-white mb-2">
                    {selectedItem.title}
                  </h2>
                  {selectedItem.description && (
                    <p className="text-ottoman-cream/80">{selectedItem.description}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
