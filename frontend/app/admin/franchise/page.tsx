'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Eye, CheckCircle, XCircle } from 'lucide-react'
import { franchiseAPI } from '@/lib/api'

export default function AdminFranchisePage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await franchiseAPI.getAll(params)
      setApplications(response.data?.applications || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Başvurular yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'approved':
        return 'text-green-500 bg-green-500/10'
      case 'rejected':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Beklemede',
      approved: 'Onaylandı',
      rejected: 'Reddedildi'
    }
    return statusMap[status] || status
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await franchiseAPI.updateStatus(id, status)
      fetchApplications()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Durum güncellenirken hata oluştu')
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
            <FileText className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-serif font-bold text-white">
              Franchise Başvuruları
            </h1>
          </div>
          <p className="text-ottoman-cream/70">
            Franchise başvurularını görüntüleyin ve yönetin
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
        ) : applications.length === 0 ? (
          <div className="card-ottoman text-center py-12">
            <FileText className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60">Başvuru bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app, index) => (
              <motion.div
                key={app._id}
                className="card-ottoman"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-ottoman-cream">
                        {app.fullName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </span>
                    </div>
                    <p className="text-sm text-ottoman-cream/60 mb-1">
                      Email: {app.contact?.email}
                    </p>
                    <p className="text-sm text-ottoman-cream/60 mb-1">
                      Telefon: {app.contact?.phone}
                    </p>
                    <p className="text-sm text-ottoman-cream/60">
                      Şehir: {app.location?.city} - Tarih: {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'approved')}
                          className="btn-ottoman-outline btn-sm bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                        >
                          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          Onayla
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'rejected')}
                          className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                        >
                          <XCircle className="w-4 h-4 mr-1 text-red-500" />
                          Reddet
                        </button>
                      </>
                    )}
                    <button className="btn-ottoman-outline btn-sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Detay
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
