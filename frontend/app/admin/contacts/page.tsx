'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Eye, Trash2 } from 'lucide-react'
import { contactAPI } from '@/lib/api'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchContacts()
  }, [filter])

  const fetchContacts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await contactAPI.getAll(params)
      setContacts(response.data?.contacts || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mesajlar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'text-blue-500 bg-blue-500/10'
      case 'in_progress':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'resolved':
        return 'text-green-500 bg-green-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      new: 'Yeni',
      in_progress: 'İşlemde',
      resolved: 'Çözüldü'
    }
    return statusMap[status] || status
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await contactAPI.updateStatus(id, status)
      fetchContacts()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Durum güncellenirken hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return

    try {
      await contactAPI.delete(id)
      fetchContacts()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Mesaj silinirken hata oluştu')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <Mail className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-serif font-bold text-white">
              İletişim Mesajları
            </h1>
          </div>
          <p className="text-ottoman-cream/70">
            Müşteri mesajlarını görüntüleyin ve yanıtlayın
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {['all', 'new', 'in_progress', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === status
                  ? 'bg-white text-ottoman-black'
                  : 'bg-ottoman-black-lighter text-ottoman-cream hover:bg-white/20'
              }`}
            >
              {status === 'all' ? 'Tümü' : getStatusText(status)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-ottoman-cream/60">Yükleniyor...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="card-ottoman text-center py-12">
            <Mail className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60">Mesaj bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact._id}
                className="card-ottoman"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-ottoman-cream">
                        {contact.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(contact.status)}`}>
                        {getStatusText(contact.status)}
                      </span>
                    </div>
                    <p className="text-sm text-ottoman-cream/60 mb-1">
                      Email: {contact.email}
                    </p>
                    {contact.phone && (
                      <p className="text-sm text-ottoman-cream/60 mb-1">
                        Telefon: {contact.phone}
                      </p>
                    )}
                    <p className="text-sm text-white mb-2">
                      Konu: {contact.subject}
                    </p>
                    <p className="text-sm text-ottoman-cream/80 mb-2 line-clamp-2">
                      {contact.message}
                    </p>
                    <p className="text-xs text-ottoman-cream/50">
                      {new Date(contact.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {contact.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(contact._id, contact.status === 'new' ? 'in_progress' : 'resolved')}
                        className="btn-ottoman-outline btn-sm"
                      >
                        {contact.status === 'new' ? 'İşleme Al' : 'Çözüldü'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
