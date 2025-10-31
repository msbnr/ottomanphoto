'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, Package } from 'lucide-react'
import { orderAPI } from '@/lib/api'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll()
      console.log('Orders response:', response.data)
      setOrders(response.data.data?.orders || [])
    } catch (err: any) {
      console.error('Orders error:', err)
      setError(err.response?.data?.message || 'Siparişler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'processing':
        return 'text-blue-500 bg-blue-500/10'
      case 'shipped':
        return 'text-purple-500 bg-purple-500/10'
      case 'delivered':
        return 'text-green-500 bg-green-500/10'
      case 'cancelled':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Beklemede',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal'
    }
    return statusMap[status] || status
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
            <ShoppingCart className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-serif font-bold text-white">
              Sipariş Yönetimi
            </h1>
          </div>
          <p className="text-ottoman-cream/70">
            Tüm siparişleri görüntüleyin ve yönetin
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-ottoman-cream/60">Yükleniyor...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card-ottoman text-center py-12">
            <Package className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60">Henüz sipariş yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                className="card-ottoman"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-ottoman-cream">
                        Sipariş #{order._id?.slice(-8)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-ottoman-cream/60 mb-1">
                      Müşteri: {order.user?.profile?.firstName} {order.user?.profile?.lastName}
                    </p>
                    <p className="text-sm text-ottoman-cream/60">
                      Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mb-2">
                      ₺{order.totalPrice?.toFixed(2)}
                    </p>
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
