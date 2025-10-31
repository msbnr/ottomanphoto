'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  CheckCircle, Package, MapPin, CreditCard,
  Truck, Calendar, Phone, Mail, Home
} from 'lucide-react'
import { orderAPI } from '@/lib/api'
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

const paymentMethodLabels: Record<string, string> = {
  cash_on_delivery: 'Kapıda Ödeme',
  bank_transfer: 'Havale / EFT',
  credit_card: 'Kredi Kartı',
}

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(orderId)
      setOrder(response.data.data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Sipariş bilgileri alınamadı')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-ottoman-gold"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sipariş Bulunamadı</h1>
          <p className="text-ottoman-cream/70 mb-8">{error || 'Sipariş bilgilerine ulaşılamadı'}</p>
          <Link href="/products" className="btn-ottoman">
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Siparişiniz Alındı!
          </h1>
          <p className="text-xl text-ottoman-cream/80 mb-2">
            Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu.
          </p>
          <p className="text-ottoman-cream/60">
            Sipariş No: <span className="text-ottoman-gold font-mono">#{order._id.slice(-8).toUpperCase()}</span>
          </p>
        </motion.div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Order Items */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-ottoman-gold" />
              <h2 className="text-2xl font-serif font-bold text-white">
                Sipariş İçeriği
              </h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-white/10 last:border-0"
                >
                  <div>
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-sm text-ottoman-cream/50">SKU: {item.sku}</p>
                    <p className="text-sm text-ottoman-cream/70">
                      {item.quantity} x ₺{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-ottoman-gold">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t-2 border-white/20">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-white">Toplam</span>
                  <span className="text-ottoman-gold">₺{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-ottoman-gold" />
              <h2 className="text-2xl font-serif font-bold text-white">
                Teslimat Adresi
              </h2>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white font-semibold mb-2">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-ottoman-cream/70 text-sm mb-1">
                {order.shippingAddress.phone}
              </p>
              <p className="text-ottoman-cream/70 text-sm">
                {order.shippingAddress.street}
              </p>
              <p className="text-ottoman-cream/70 text-sm">
                {order.shippingAddress.state} / {order.shippingAddress.city} {order.shippingAddress.postalCode}
              </p>
              <p className="text-ottoman-cream/70 text-sm">
                {order.shippingAddress.country}
              </p>
            </div>
          </motion.div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Method */}
            <motion.div
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-ottoman-gold" />
                <h3 className="text-lg font-semibold text-white">
                  Ödeme Yöntemi
                </h3>
              </div>
              <p className="text-ottoman-cream/80">
                {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
              </p>
              <p className="text-sm text-ottoman-cream/50 mt-1">
                Durum: {order.paymentStatus === 'pending' ? 'Ödeme Bekleniyor' : 'Ödendi'}
              </p>
            </motion.div>

            {/* Order Status */}
            <motion.div
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-ottoman-gold" />
                <h3 className="text-lg font-semibold text-white">
                  Sipariş Durumu
                </h3>
              </div>
              <p className="text-ottoman-cream/80">
                {statusLabels[order.status] || order.status}
              </p>
              <p className="text-sm text-ottoman-cream/50 mt-1">
                Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </motion.div>
          </div>

          {/* Order Note */}
          {order.notes && (
            <motion.div
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                Sipariş Notu
              </h3>
              <p className="text-ottoman-cream/70 text-sm">
                {order.notes}
              </p>
            </motion.div>
          )}

          {/* Next Steps Info */}
          <motion.div
            className="card-ottoman bg-gradient-to-br from-ottoman-gold/10 to-ottoman-red/10 border border-ottoman-gold/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Sıradaki Adımlar
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-ottoman-gold flex-shrink-0 mt-0.5" />
                <p className="text-ottoman-cream/80 text-sm">
                  Sipariş onay maili e-posta adresinize gönderildi
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-ottoman-gold flex-shrink-0 mt-0.5" />
                <p className="text-ottoman-cream/80 text-sm">
                  Sipariş durumu ile ilgili size SMS ile bilgilendirme yapılacaktır
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-ottoman-gold flex-shrink-0 mt-0.5" />
                <p className="text-ottoman-cream/80 text-sm">
                  Siparişiniz hazırlandıktan sonra kargoya verilecektir
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              href="/orders"
              className="flex-1 btn-ottoman flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Siparişlerim
            </Link>
            <Link
              href="/products"
              className="flex-1 btn-ottoman-outline flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Alışverişe Devam Et
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div
            className="text-center text-ottoman-cream/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>
              Sorularınız için{' '}
              <Link href="/contact" className="text-ottoman-gold hover:underline">
                iletişim
              </Link>{' '}
              sayfasından bize ulaşabilirsiniz.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
