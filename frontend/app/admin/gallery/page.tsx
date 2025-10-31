'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Video, Plus, Trash2, Edit2, Upload, ArrowUp, ArrowDown, Eye, EyeOff, Youtube, Instagram, Folder } from 'lucide-react'
import { galleryAPI, albumAPI } from '@/lib/api'
import Link from 'next/link'

interface Album {
  _id: string
  name: string
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

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [filterAlbum, setFilterAlbum] = useState<string>('all')
  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    videoPlatform: 'youtube' as 'youtube' | 'youtube-shorts' | 'instagram',
    thumbnail: '',
    album: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchItems()
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      const response = await albumAPI.getAllAdmin()
      if (response.data.data.albums) {
        setAlbums(response.data.data.albums)
      }
    } catch (error) {
      console.error('Error fetching albums:', error)
    }
  }

  const fetchItems = async () => {
    try {
      const response = await galleryAPI.getAllAdmin()
      if (response.data.data.items) {
        setItems(response.data.data.items)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const data = new FormData()
      data.append('image', file)

      const response = await galleryAPI.uploadImage(data)
      setFormData({ ...formData, imageUrl: response.data.data.imageUrl })
      alert('Resim başarıyla yüklendi')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Resim yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const dataToSend = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        imageUrl: formData.type === 'image' ? formData.imageUrl : undefined,
        videoUrl: formData.type === 'video' ? formData.videoUrl : undefined,
        videoPlatform: formData.type === 'video' ? formData.videoPlatform : undefined,
        thumbnail: formData.thumbnail || undefined,
        album: formData.album || null,
        order: formData.order,
        isActive: formData.isActive,
      }

      if (editingItem) {
        await galleryAPI.update(editingItem._id, dataToSend)
        alert('Öğe güncellendi')
      } else {
        await galleryAPI.create(dataToSend)
        alert('Öğe eklendi')
      }
      fetchItems()
      handleCancel()
    } catch (error: any) {
      alert(error.response?.data?.message || 'İşlem sırasında hata oluştu')
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      videoUrl: item.videoUrl || '',
      videoPlatform: item.videoPlatform || 'youtube',
      thumbnail: item.thumbnail || '',
      album: item.album?._id || '',
      order: item.order,
      isActive: item.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return

    try {
      await galleryAPI.delete(id)
      alert('Öğe silindi')
      fetchItems()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Silme işlemi başarısız')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({
      type: 'image',
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      videoPlatform: 'youtube',
      thumbnail: '',
      album: '',
      order: 0,
      isActive: true,
    })
  }

  const toggleActive = async (item: GalleryItem) => {
    try {
      await galleryAPI.update(item._id, { isActive: !item.isActive })
      fetchItems()
    } catch (error) {
      alert('Durum değiştirilemedi')
    }
  }

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) return

    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]

    // Update order
    try {
      await Promise.all(
        newItems.map((item, idx) =>
          galleryAPI.update(item._id, { order: idx })
        )
      )
      setItems(newItems)
    } catch (error) {
      alert('Sıralama güncellenemedi')
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'

  // Filter items by album
  const filteredItems = filterAlbum === 'all'
    ? items
    : filterAlbum === 'uncategorized'
    ? items.filter(item => !item.album)
    : items.filter(item => item.album?._id === filterAlbum)

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-white">Galeri Yönetimi</h1>
              <p className="text-ottoman-cream/70 mt-2">Fotoğraf ve video yönetimi</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin/albums"
                className="btn-ottoman-outline flex items-center space-x-2"
              >
                <Folder className="w-5 h-5" />
                <span>Albüm Yönetimi</span>
              </Link>
              <button
                onClick={() => {
                  handleCancel()
                  setShowForm(true)
                }}
                className="btn-ottoman flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Ekle</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Album Filter */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <label className="block text-sm font-medium text-ottoman-cream mb-2">
            Albüme Göre Filtrele
          </label>
          <select
            className="input-ottoman max-w-xs"
            value={filterAlbum}
            onChange={(e) => setFilterAlbum(e.target.value)}
          >
            <option value="all">Tüm Öğeler</option>
            <option value="uncategorized">Kategorisiz</option>
            {albums.map(album => (
              <option key={album._id} value={album._id}>
                {album.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.div
            className="card-ottoman mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingItem ? 'Öğe Düzenle' : 'Yeni Öğe Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">Tür</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="image"
                      checked={formData.type === 'image'}
                      onChange={(e) => setFormData({ ...formData, type: 'image' })}
                      className="w-4 h-4"
                    />
                    <ImageIcon className="w-5 h-5 text-white" />
                    <span className="text-white">Fotoğraf</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="video"
                      checked={formData.type === 'video'}
                      onChange={(e) => setFormData({ ...formData, type: 'video' })}
                      className="w-4 h-4"
                    />
                    <Video className="w-5 h-5 text-white" />
                    <span className="text-white">Video</span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">Başlık *</label>
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
                <label className="block text-sm font-medium text-ottoman-cream mb-2">Açıklama</label>
                <textarea
                  className="input-ottoman min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Image Upload */}
              {formData.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">Fotoğraf *</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`btn-ottoman-outline inline-flex items-center space-x-2 cursor-pointer ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="w-5 h-5" />
                      <span>{uploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</span>
                    </label>
                    {formData.imageUrl && (
                      <img
                        src={`${baseUrl}${formData.imageUrl}`}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Video Platform & URL */}
              {formData.type === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Video Platformu *
                    </label>
                    <select
                      className="input-ottoman"
                      value={formData.videoPlatform}
                      onChange={(e) => setFormData({ ...formData, videoPlatform: e.target.value as 'youtube' | 'youtube-shorts' | 'instagram' })}
                    >
                      <option value="youtube">YouTube</option>
                      <option value="youtube-shorts">YouTube Shorts</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      className="input-ottoman"
                      placeholder={
                        formData.videoPlatform === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                        formData.videoPlatform === 'youtube-shorts' ? 'https://youtube.com/shorts/...' :
                        'https://www.instagram.com/reel/...'
                      }
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      required
                    />
                    <p className="text-xs text-ottoman-cream/50 mt-1 flex items-center space-x-1">
                      {formData.videoPlatform === 'youtube' && (
                        <>
                          <Youtube className="w-3 h-3" />
                          <span>YouTube video linki girin</span>
                        </>
                      )}
                      {formData.videoPlatform === 'youtube-shorts' && (
                        <>
                          <Youtube className="w-3 h-3" />
                          <span>YouTube Shorts linki girin</span>
                        </>
                      )}
                      {formData.videoPlatform === 'instagram' && (
                        <>
                          <Instagram className="w-3 h-3" />
                          <span>Instagram video linki girin</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Thumbnail URL (Opsiyonel)
                    </label>
                    <input
                      type="url"
                      className="input-ottoman"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Album Selection */}
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Albüm
                </label>
                <select
                  className="input-ottoman"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                >
                  <option value="">Kategorisiz</option>
                  {albums.filter(a => a.isActive).map(album => (
                    <option key={album._id} value={album._id}>
                      {album.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-ottoman-cream/50 mt-1">
                  Bu öğeyi bir albüme ekleyin veya kategorisiz bırakın
                </p>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
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
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Durum
                  </label>
                  <div className="flex items-center space-x-2 mt-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="isActive" className="text-ottoman-cream cursor-pointer">
                      Aktif
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-2">
                <button type="submit" className="btn-ottoman flex-1">
                  {editingItem ? 'Güncelle' : 'Ekle'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-ottoman-outline flex-1">
                  İptal
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {loading ? (
            <div className="card-ottoman animate-pulse h-32" />
          ) : filteredItems.length === 0 ? (
            <div className="card-ottoman text-center py-12">
              <p className="text-ottoman-cream/50">
                {filterAlbum === 'all' ? 'Henüz öğe eklenmemiş' : 'Bu filtrede öğe bulunamadı'}
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                className="card-ottoman flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Thumbnail */}
                <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black relative">
                  {item.type === 'image' ? (
                    <img
                      src={`${baseUrl}${item.imageUrl}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900" />
                      <Video className="absolute inset-0 m-auto w-8 h-8 text-white" />
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {item.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Video className="w-4 h-4 text-purple-500" />
                    )}
                    <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
                    {item.type === 'video' && item.videoPlatform && (
                      <span className="inline-flex items-center space-x-1 bg-white/10 px-2 py-0.5 rounded text-xs text-white">
                        {item.videoPlatform === 'youtube' && (
                          <>
                            <Youtube className="w-3 h-3" />
                            <span>YouTube</span>
                          </>
                        )}
                        {item.videoPlatform === 'youtube-shorts' && (
                          <>
                            <Youtube className="w-3 h-3" />
                            <span>Shorts</span>
                          </>
                        )}
                        {item.videoPlatform === 'instagram' && (
                          <>
                            <Instagram className="w-3 h-3" />
                            <span>Instagram</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-ottoman-cream/60 line-clamp-2">{item.description}</p>
                  )}
                  {item.album && (
                    <p className="text-xs text-blue-400 mt-1">
                      📁 {item.album.name}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className={`btn-ottoman-outline btn-sm ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className={`btn-ottoman-outline btn-sm ${
                      index === items.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                    }`}
                  >
                    {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn-ottoman-outline btn-sm bg-blue-500/10 border-blue-500/20"
                  >
                    <Edit2 className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
