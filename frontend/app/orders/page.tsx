'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Package, MapPin, Calendar, ChevronRight,
  Truck, CheckCircle, XCircle, Clock, Search, Filter
} from 'lucide-react'
import { orderAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

interface Order {
  _id: string
  userId: string
  userType: string
  items: Array<{
    productId: string
    name: string
    sku: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: string
  paymentMethod: string
  paymentStatus: string
  shippingAddress: {
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusConfig: Record<string, {
  label: string
  icon: any
  color: string
  bgColor: string
}> = {
  pending: {
    label: 'Beklemede',
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
  },
  confirmed: {
    label: 'Onaylandı',
    icon: CheckCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  shipped: {
    label: 'Kargoda',
    icon: Truck,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
  },
  delivered: {
    label: 'Teslim Edildi',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 border-green-500/20',
  },
  cancelled: {
    label: 'İptal Edildi',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 border-red-500/20',
  },
}

const paymentMethodLabels: Record<string, string> = {
  cash_on_delivery: 'Kapıda Ödeme',
  bank_transfer: 'Havale / EFT',
  credit_card: 'Kredi Kartı',
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders')
      return
    }

    fetchOrders()
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders()
      setOrders(response.data.data?.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-ottoman-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-serif font-bold text-white mb-2">
            Siparişlerim
          </h1>
          <p className="text-ottoman-cream/70">
            Tüm siparişlerinizi buradan takip edebilirsiniz
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="card-ottoman mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ottoman-cream/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sipariş numarası veya ürün ara..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-ottoman-cream/50 focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ottoman-cream/50" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="all">Tüm Siparişler</option>
                <option value="pending">Beklemede</option>
                <option value="confirmed">Onaylandı</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            className="card-ottoman text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Package className="w-24 h-24 text-ottoman-cream/30 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-white mb-2">
              {searchQuery || filterStatus !== 'all' ? 'Sipariş Bulunamadı' : 'Henüz Sipariş Yok'}
            </h2>
            <p className="text-ottoman-cream/70 mb-8">
              {searchQuery || filterStatus !== 'all'
                ? 'Arama kriterlerinize uygun sipariş bulunamadı'
                : 'İlk siparişinizi vermek için ürünlerimize göz atın'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Link href="/products" className="btn-ottoman">
                Ürünleri İncele
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <motion.div
                    key={order._id}
                    className="card-ottoman overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-serif font-bold text-white">
                            Sipariş #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.bgColor} ${status.color}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-ottoman-cream/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span>{order.items.length} Ürün</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-ottoman-gold">
                          ₺{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-ottoman-cream/60">
                          {paymentMethodLabels[order.paymentMethod]}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="py-4 space-y-3">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <p className="text-sm text-ottoman-cream/60">
                              {item.quantity} x ₺{item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-ottoman-gold font-semibold">
                            ₺{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-ottoman-cream/60 text-sm">
                          +{order.items.length - 3} ürün daha
                        </p>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div className="py-4 border-t border-white/10">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-ottoman-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium mb-1">
                            {order.shippingAddress.fullName}
                          </p>
                          <p className="text-sm text-ottoman-cream/70">
                            {order.shippingAddress.street}, {order.shippingAddress.state} / {order.shippingAddress.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/10">
                      <Link
                        href={`/order-confirmation/${order._id}`}
                        className="btn-ottoman-outline w-full flex items-center justify-center gap-2"
                      >
                        Detayları Görüntüle
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Results Count */}
        {filteredOrders.length > 0 && (
          <motion.div
            className="text-center text-ottoman-cream/50 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Toplam {filteredOrders.length} sipariş gösteriliyor
          </motion.div>
        )}
      </div>
    </div>
  )
}
