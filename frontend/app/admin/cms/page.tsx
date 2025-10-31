'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Edit2, Trash2, Eye } from 'lucide-react'
import axios from '@/lib/api'

interface Page {
  _id: string
  title: string
  slug: string
  content: string
  isPublished: boolean
  showInMenu: boolean
  menuOrder: number
  createdAt: string
  updatedAt: string
}

export default function AdminCMSPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    isPublished: true,
    showInMenu: false,
    menuOrder: 0,
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await axios.get('/pages')
      setPages(response.data || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sayfalar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPage) {
        await axios.put(`/pages/admin/${editingPage._id}`, formData)
      } else {
        await axios.post('/pages/admin', formData)
      }
      setShowForm(false)
      setEditingPage(null)
      setFormData({ title: '', slug: '', content: '', isPublished: true, showInMenu: false, menuOrder: 0 })
      fetchPages()
    } catch (err: any) {
      alert(err.response?.data?.message || 'İşlem sırasında hata oluştu')
    }
  }

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished,
      showInMenu: page.showInMenu,
      menuOrder: page.menuOrder,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return

    try {
      await axios.delete(`/pages/admin/${id}`)
      fetchPages()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Sayfa silinirken hata oluştu')
    }
  }

  const handleTogglePublished = async (id: string) => {
    try {
      await axios.patch(`/pages/admin/${id}/toggle`)
      fetchPages()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Durum güncellenirken hata oluştu')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <FileText className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-serif font-bold text-white">
                İçerik Yönetimi (CMS)
              </h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingPage(null)
                setFormData({ title: '', slug: '', content: '', isPublished: true, showInMenu: false, menuOrder: 0 })
              }}
              className="btn-ottoman"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Sayfa
            </button>
          </div>
          <p className="text-ottoman-cream/70">
            Gizlilik politikası, kullanım şartları, SSS vb. sayfaları yönetin
          </p>
        </motion.div>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="card-ottoman max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingPage ? 'Sayfayı Düzenle' : 'Yeni Sayfa Oluştur'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Sayfa Başlığı *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="privacy-policy"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    İçerik *
                  </label>
                  <textarea
                    className="input-ottoman min-h-[300px] font-mono text-sm"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Markdown formatında içerik yazabilirsiniz..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Menü Sırası
                    </label>
                    <input
                      type="number"
                      className="input-ottoman"
                      value={formData.menuOrder}
                      onChange={(e) => setFormData({ ...formData, menuOrder: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-white/30"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      />
                      <span className="text-sm text-ottoman-cream">Yayında</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-white/30"
                        checked={formData.showInMenu}
                        onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                      />
                      <span className="text-sm text-ottoman-cream">Menüde Göster</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-ottoman flex-1">
                    {editingPage ? 'Güncelle' : 'Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-ottoman-outline flex-1"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-ottoman-cream/60">Yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pages.map((page, index) => (
              <motion.div
                key={page._id}
                className="card-ottoman"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-ottoman-cream">
                        {page.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        page.isPublished ? 'text-green-500 bg-green-500/10' : 'text-gray-500 bg-gray-500/10'
                      }`}>
                        {page.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                      {page.showInMenu && (
                        <span className="px-3 py-1 rounded-full text-sm text-blue-500 bg-blue-500/10">
                          Menüde
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ottoman-cream/60 mb-1">
                      URL: /{page.slug}
                    </p>
                    <p className="text-xs text-ottoman-cream/50">
                      Son güncelleme: {new Date(page.updatedAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(`/${page.slug}`, '_blank')}
                      className="btn-ottoman-outline btn-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(page)}
                      className="btn-ottoman-outline btn-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTogglePublished(page._id)}
                      className="btn-ottoman-outline btn-sm"
                    >
                      {page.isPublished ? 'Gizle' : 'Yayınla'}
                    </button>
                    <button
                      onClick={() => handleDelete(page._id)}
                      className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {pages.length === 0 && (
              <div className="card-ottoman text-center py-12">
                <FileText className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
                <p className="text-ottoman-cream/60">Henüz sayfa oluşturulmamış</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
