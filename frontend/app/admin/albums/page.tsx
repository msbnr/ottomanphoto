'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Folder, Image as ImageIcon } from 'lucide-react'
import { albumAPI } from '@/lib/api'

interface Album {
  _id: string
  name: string
  description?: string
  coverImage?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: '',
    order: 0,
    isActive: true,
  })
  const [saving, setSaving] = useState(false)

  // Get base URL with fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      const response = await albumAPI.getAllAdmin()
      const data = response.data
      if (data.data && Array.isArray(data.data.albums)) {
        setAlbums(data.data.albums)
      }
    } catch (error) {
      console.error('Error fetching albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingAlbum) {
        await albumAPI.update(editingAlbum._id, formData)
        alert('Albüm başarıyla güncellendi')
      } else {
        await albumAPI.create(formData)
        alert('Albüm başarıyla oluşturuldu')
      }

      fetchAlbums()
      closeModal()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Albüm kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (album: Album) => {
    setEditingAlbum(album)
    setFormData({
      name: album.name,
      description: album.description || '',
      coverImage: album.coverImage || '',
      order: album.order,
      isActive: album.isActive,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu albümü silmek istediğinizden emin misiniz?')) return

    try {
      await albumAPI.delete(id)
      alert('Albüm başarıyla silindi')
      fetchAlbums()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Albüm silinirken hata oluştu')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAlbum(null)
    setFormData({ name: '', description: '', coverImage: '', order: 0, isActive: true })
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
              Albüm Yönetimi
            </h1>
            <p className="text-ottoman-cream/70">
              Galeri albümlerini oluştur ve düzenle
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-ottoman flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Albüm</span>
          </button>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, index) => (
            <motion.div
              key={album._id}
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative aspect-[16/9] mb-4 rounded-lg overflow-hidden bg-white/5">
                {album.coverImage ? (
                  <img
                    src={album.coverImage.startsWith('http') ? album.coverImage : `${baseUrl}${album.coverImage}`}
                    alt={album.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Folder className="w-16 h-16 text-white/20" />
                  </div>
                )}
                {!album.isActive && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <EyeOff className="w-12 h-12 text-white/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                  Sıra: {album.order}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {album.name}
              </h3>
              {album.description && (
                <p className="text-sm text-ottoman-cream/70 mb-4 line-clamp-2">
                  {album.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  album.isActive
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {album.isActive ? 'Aktif' : 'Pasif'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(album)}
                    className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(album._id)}
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

        {albums.length === 0 && (
          <div className="card-ottoman text-center py-12">
            <Folder className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60">
              Henüz albüm yok. İlk albümünüzü oluşturun!
            </p>
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
                {editingAlbum ? 'Albüm Düzenle' : 'Yeni Albüm'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Albüm Adı *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Örn: Ürün Fotoğrafları"
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
                    placeholder="Albüm hakkında kısa açıklama"
                  />
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Kapak Resmi URL
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    placeholder="https://example.com/image.jpg veya /uploads/image.jpg"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                  <p className="text-xs text-ottoman-cream/50 mt-1">
                    Opsiyonel: Albüm kapak resmi için URL girin
                  </p>
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
                    {saving ? 'Kaydediliyor...' : editingAlbum ? 'Albümü Güncelle' : 'Albüm Oluştur'}
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
