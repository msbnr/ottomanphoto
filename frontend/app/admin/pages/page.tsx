'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, EyeOff, FileText } from 'lucide-react'
import Link from 'next/link'

// Mock data
const pages = [
  {
    id: '1',
    title: 'Gizlilik Politikası',
    slug: 'gizlilik-politikasi',
    isPublished: true,
    showInMenu: true,
    menuOrder: 1,
    updatedAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    title: 'Kullanım Koşulları',
    slug: 'kullanim-kosullari',
    isPublished: true,
    showInMenu: true,
    menuOrder: 2,
    updatedAt: '2024-01-14T15:20:00',
  },
  {
    id: '3',
    title: 'İade ve Değişim',
    slug: 'iade-ve-degisim',
    isPublished: true,
    showInMenu: false,
    menuOrder: 0,
    updatedAt: '2024-01-10T09:15:00',
  },
  {
    id: '4',
    title: 'Teslimat Bilgileri',
    slug: 'teslimat-bilgileri',
    isPublished: false,
    showInMenu: false,
    menuOrder: 0,
    updatedAt: '2024-01-05T12:00:00',
  },
]

export default function AdminPagesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTogglePublished = async (pageId: string) => {
    // TODO: API call to toggle published status
    alert(`Sayfa yayın durumu değiştirildi: ${pageId}`)
  }

  const handleDelete = async (pageId: string) => {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) {
      return
    }
    // TODO: API call to delete page
    alert(`Sayfa ${pageId} silindi`)
  }

  const handlePreview = (slug: string) => {
    window.open(`/p/${slug}`, '_blank')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              <span className="text-white">
                Sayfa Yönetimi
              </span>
            </h1>
            <p className="text-ottoman-cream/70">
              Dinamik sayfalar oluştur ve yönet
            </p>
          </div>
          <Link href="/admin/pages/new" className="btn-ottoman flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Yeni Sayfa</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-ottoman text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {pages.length}
            </div>
            <div className="text-sm text-ottoman-cream/70">Toplam Sayfa</div>
          </div>
          <div className="card-ottoman text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {pages.filter(p => p.isPublished).length}
            </div>
            <div className="text-sm text-ottoman-cream/70">Yayında</div>
          </div>
          <div className="card-ottoman text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {pages.filter(p => p.showInMenu).length}
            </div>
            <div className="text-sm text-ottoman-cream/70">Menüde Gösterilen</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
            <input
              type="text"
              placeholder="Sayfa başlığı veya URL ile ara..."
              className="input-ottoman pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Pages Table */}
        <div className="card-ottoman overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-white font-semibold">Başlık</th>
                  <th className="text-left p-4 text-white font-semibold">URL</th>
                  <th className="text-center p-4 text-white font-semibold">Yayında</th>
                  <th className="text-center p-4 text-white font-semibold">Menüde</th>
                  <th className="text-left p-4 text-white font-semibold">Son Güncelleme</th>
                  <th className="text-right p-4 text-white font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page, index) => (
                  <motion.tr
                    key={page.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-white" />
                        <span className="text-ottoman-cream font-medium">
                          {page.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream/70 font-mono text-sm">
                        /p/{page.slug}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {page.isPublished ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Yayında
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {page.showInMenu ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream/70 text-sm">
                        {new Date(page.updatedAt).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handlePreview(page.slug)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Sayfayı Önizle"
                        >
                          <Eye className="w-4 h-4 text-ottoman-cream/70" />
                        </button>
                        <button
                          onClick={() => handleTogglePublished(page.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            page.isPublished
                              ? 'hover:bg-red-500/10 text-red-500'
                              : 'hover:bg-green-500/10 text-green-500'
                          }`}
                          title={page.isPublished ? 'Yayından Kaldır' : 'Yayınla'}
                        >
                          {page.isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/admin/pages/${page.id}`}
                          className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Sayfayı Düzenle"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Sayfayı Sil"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/70 text-lg">
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz sayfa oluşturulmamış'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
