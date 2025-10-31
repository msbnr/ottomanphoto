'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, Crop } from 'lucide-react'
import axios from '@/lib/api'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { getImageUrl } from '@/lib/utils'

interface Banner {
  _id: string
  title: string
  description?: string
  imageUrl: string
  link?: string
  order: number
  isActive: boolean
  createdAt: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    order: 0,
    isActive: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Crop states
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropImage, setCropImage] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('')

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/banners/admin')
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

  // Create image from URL
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  // Get cropped image
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    fileName: string
  ): Promise<File> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    // Set canvas size to the cropped area
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Convert canvas to blob then to file
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        const file = new File([blob], fileName, { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg', 0.95)
    })
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const applyCrop = async () => {
    if (!croppedAreaPixels || !cropImage) return

    try {
      const croppedFile = await getCroppedImg(cropImage, croppedAreaPixels, originalFileName)

      // Set the cropped file
      setImageFile(croppedFile)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(croppedFile)

      // Close crop modal
      setShowCropModal(false)
      setCropImage('')
    } catch (error) {
      console.error('Error cropping image:', error)
      alert('Resim kırpılırken hata oluştu')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Resim boyutu 5MB\'dan küçük olmalıdır')
        return
      }

      // Check image dimensions
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        const width = img.width
        const height = img.height

        // Recommended: 1920x600, but allow 1600-2400 width and 500-800 height
        const isWidthValid = width >= 1600 && width <= 2400
        const isHeightValid = height >= 500 && height <= 800

        if (!isWidthValid || !isHeightValid) {
          // Show crop modal for images that don't meet criteria
          const reader = new FileReader()
          reader.onloadend = () => {
            setCropImage(reader.result as string)
            setOriginalFileName(file.name)
            setShowCropModal(true)
            URL.revokeObjectURL(objectUrl)
          }
          reader.readAsDataURL(file)
        } else {
          // If validation passes, set the file directly
          setImageFile(file)
          const reader = new FileReader()
          reader.onloadend = () => {
            setImagePreview(reader.result as string)
          }
          reader.readAsDataURL(file)
          URL.revokeObjectURL(objectUrl)
        }
      }

      img.src = objectUrl
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('link', formData.link)
      formDataToSend.append('order', formData.order.toString())
      formDataToSend.append('isActive', formData.isActive.toString())

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (editingBanner) {
        await axios.put(`/banners/${editingBanner._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Banner başarıyla güncellendi')
      } else {
        await axios.post('/banners', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Banner başarıyla oluşturuldu')
      }

      fetchBanners()
      closeModal()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Banner kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description || '',
      link: banner.link || '',
      order: banner.order,
      isActive: banner.isActive,
    })
    setImagePreview(getImageUrl(banner.imageUrl))
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu banner\'ı silmek istediğinizden emin misiniz?')) return

    try {
      await axios.delete(`/banners/${id}`)
      alert('Banner başarıyla silindi')
      fetchBanners()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Banner silinirken hata oluştu')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBanner(null)
    setFormData({ title: '', description: '', link: '', order: 0, isActive: true })
    setImageFile(null)
    setImagePreview(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ottoman-cream/60">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Banner Yönetimi
            </h1>
            <p className="text-ottoman-cream/70">
              Anasayfa banner&apos;larını ve carousel&apos;ini yönet
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-ottoman flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Banner</span>
          </button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <motion.div
              key={banner._id}
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative aspect-[16/9] mb-4 rounded-lg overflow-hidden bg-white/5">
                <img
                  src={getImageUrl(banner.imageUrl)}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <EyeOff className="w-12 h-12 text-white/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                  Order: {banner.order}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {banner.title}
              </h3>
              {banner.description && (
                <p className="text-sm text-ottoman-cream/70 mb-4 line-clamp-2">
                  {banner.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  banner.isActive
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {banner.isActive ? 'Aktif' : 'Pasif'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="card-ottoman text-center py-12">
            <ImageIcon className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60">
              Henüz banner yok. İlk banner&apos;ınızı oluşturun!
            </p>
          </div>
        )}

        {/* Crop Modal */}
        {showCropModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90">
            <motion.div
              className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 max-w-4xl w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Resmi Kırp
              </h2>
              <p className="text-ottoman-cream/70 mb-4">
                Resminiz banner kriterlerine uymuyor. Lütfen resmi 1600-2400px genişlik ve 500-800px yükseklik arasında olacak şekilde kırpın.
              </p>

              {/* Cropper */}
              <div className="relative w-full h-[400px] bg-black rounded-lg mb-4">
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={2.4}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              {/* Zoom Control */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Yakınlaştırma
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={applyCrop}
                  className="btn-ottoman flex-1"
                >
                  <Crop className="w-4 h-4 mr-2 inline" />
                  Kırpmayı Uygula
                </button>
                <button
                  onClick={() => {
                    setShowCropModal(false)
                    setCropImage('')
                  }}
                  className="btn-ottoman-outline flex-1"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingBanner ? 'Banner Düzenle' : 'Yeni Banner'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Banner Resmi * (JPG, PNG - Önerilen: 1920x600px)
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Önizleme"
                          className="w-full h-48 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleImageChange}
                          className="hidden"
                          id="banner-image"
                          required={!editingBanner}
                        />
                        <label
                          htmlFor="banner-image"
                          className="btn-ottoman-outline cursor-pointer inline-block"
                        >
                          Resim Seç
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Açıklama
                  </label>
                  <textarea
                    className="input-ottoman min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Link URL (opsiyonel)
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    placeholder="/products veya https://example.com"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>

                {/* Order & Active */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Görüntüleme Sırası
                    </label>
                    <input
                      type="number"
                      className="input-ottoman"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Durum
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer mt-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span className="text-white">Aktif</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-ottoman flex-1"
                  >
                    {saving ? 'Kaydediliyor...' : editingBanner ? 'Banner Güncelle' : 'Banner Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-ottoman-outline flex-1"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
