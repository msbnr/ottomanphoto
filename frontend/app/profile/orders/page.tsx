'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { orderAPI } from '@/lib/api'

interface Order {
  _id: string
  items: Array<{
    productId: string
    name: string
    sku: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await orderAPI.getMyOrders()
      const ordersData = response.data.data?.orders || []
      setOrders(Array.isArray(ordersData) ? ordersData : [])
    } catch (err: any) {
      console.error('Orders fetch error:', err)
      setError(err.response?.data?.message || 'Siparişler yüklenirken bir hata oluştu')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Beklemede', icon: Clock, color: 'text-yellow-500' }
      case 'confirmed':
        return { text: 'Onaylandı', icon: CheckCircle, color: 'text-blue-500' }
      case 'shipped':
        return { text: 'Kargoda', icon: Package, color: 'text-indigo-500' }
      case 'delivered':
        return { text: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-500' }
      case 'cancelled':
        return { text: 'İptal Edildi', icon: XCircle, color: 'text-red-500' }
      default:
        return { text: status, icon: Clock, color: 'text-ottoman-cream/70' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="card-ottoman">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="card-ottoman">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">
          Siparişlerim
        </h1>
        <p className="text-ottoman-cream/70">
          Geçmiş siparişlerinizi görüntüleyin ve takip edin
        </p>
      </div>

      {error && (
        <div className="card-ottoman bg-red-500/10 border border-red-500/50">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="card-ottoman">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ottoman-cream mb-2">
              Sipariş bulunamadı
            </h3>
            <p className="text-ottoman-cream/60 mb-6">
              Henüz bir siparişiniz bulunmamaktadır.
            </p>
            <Link href="/products" className="btn-ottoman inline-flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Alışverişe Başla
            </Link>
          </div>
        </div>
      )}

      {!error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon

            return (
              <div key={order._id} className="card-ottoman">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 pb-4 border-b border-white/20">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-lg font-semibold text-ottoman-cream mb-1">
                      Sipariş #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-ottoman-cream/60">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 ${statusInfo.color}`}>
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-medium">{statusInfo.text}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-ottoman-black-lighter rounded-lg">
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-white/50" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-ottoman-cream">{item.name}</h4>
                        <p className="text-sm text-ottoman-cream/60">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-ottoman-cream/70">Adet: {item.quantity}</p>
                        <p className="font-semibold text-white">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div>
                    <p className="text-sm text-ottoman-cream/60 mb-1">Toplam Tutar</p>
                    <p className="text-2xl font-bold text-white">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <Link
                    href={`/profile/orders/${order._id}`}
                    className="btn-ottoman-outline inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Detayları Gör
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
