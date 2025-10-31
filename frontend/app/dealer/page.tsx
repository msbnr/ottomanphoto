'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Package, ShoppingCart, TrendingUp, Award,
  DollarSign, Users, Calendar, ArrowRight,
  AlertCircle, BarChart3
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { orderAPI } from '@/lib/api'
import Link from 'next/link'

const dealerTierLabels: Record<string, string> = {
  small: 'Küçük Bayi',
  medium: 'Orta Bayi',
  large: 'Büyük Bayi',
  main_dealer: 'Ana Bayi',
}

const dealerTierColors: Record<string, string> = {
  small: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  medium: 'bg-green-500/10 border-green-500/20 text-green-400',
  large: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  main_dealer: 'bg-ottoman-gold/10 border-ottoman-gold/20 text-ottoman-gold',
}

interface OrderStats {
  total: number
  pending: number
  confirmed: number
  shipped: number
  delivered: number
  totalAmount: number
}

export default function DealerDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    totalAmount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dealer')
      return
    }

    if (user?.userType !== 'dealer') {
      router.push('/')
      return
    }

    fetchDealerData()
  }, [isAuthenticated, user])

  const fetchDealerData = async () => {
    try {
      const response = await orderAPI.getMyOrders()
      const orderData = response.data.data?.orders || []
      setOrders(orderData)

      // Calculate stats
      const statsCalc = orderData.reduce(
        (acc: OrderStats, order: any) => {
          acc.total++
          acc[order.status as keyof OrderStats]++
          acc.totalAmount += order.totalAmount
          return acc
        },
        {
          total: 0,
          pending: 0,
          confirmed: 0,
          shipped: 0,
          delivered: 0,
          totalAmount: 0,
        }
      )
      setStats(statsCalc)
    } catch (error) {
      console.error('Error fetching dealer data:', error)
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

  if (!user || user.userType !== 'dealer') {
    return null
  }

  const tierClass = dealerTierColors[user.dealerTier || 'small']
  const tierLabel = dealerTierLabels[user.dealerTier || 'small']

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-white mb-2">
                Bayi Paneli
              </h1>
              <p className="text-ottoman-cream/70">
                Hoş geldiniz, {user.profile?.firstName || user.profile?.companyName || 'Bayi'}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-lg border ${tierClass} font-semibold`}>
              <Award className="w-5 h-5 inline mr-2" />
              {tierLabel}
            </div>
          </div>

          {/* Tier Benefits Notice */}
          <motion.div
            className="card-ottoman bg-gradient-to-r from-ottoman-gold/10 to-ottoman-red/10 border-ottoman-gold/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-ottoman-gold flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Bayi Avantajlarınız</h3>
                <p className="text-ottoman-cream/80 text-sm">
                  {user.dealerTier === 'main_dealer' && 'Ana bayi olarak en yüksek indirim oranlarından faydalanıyorsunuz.'}
                  {user.dealerTier === 'large' && 'Büyük bayi olarak özel fiyatlandırmadan faydalanıyorsunuz.'}
                  {user.dealerTier === 'medium' && 'Orta bayi olarak avantajlı fiyatlardan faydalanıyorsunuz.'}
                  {user.dealerTier === 'small' && 'Küçük bayi olarak özel bayi fiyatlarından faydalanıyorsunuz.'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-ottoman-gold/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-ottoman-gold" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-ottoman-cream mb-1">
              ₺{stats.totalAmount.toLocaleString('tr-TR')}
            </h3>
            <p className="text-sm text-ottoman-cream/60">Toplam Sipariş Tutarı</p>
          </motion.div>

          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-ottoman-cream mb-1">
              {stats.total}
            </h3>
            <p className="text-sm text-ottoman-cream/60">Toplam Sipariş</p>
          </motion.div>

          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-ottoman-cream mb-1">
              {stats.delivered}
            </h3>
            <p className="text-sm text-ottoman-cream/60">Teslim Edilen</p>
          </motion.div>

          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-ottoman-cream mb-1">
              {stats.pending + stats.confirmed}
            </h3>
            <p className="text-sm text-ottoman-cream/60">Bekleyen Sipariş</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/products">
              <div className="card-ottoman hover:border-ottoman-gold/40 transition-all cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Ürünler
                    </h3>
                    <p className="text-sm text-ottoman-cream/70 mb-3">
                      Bayi fiyatları ile ürünlere göz atın
                    </p>
                    <div className="flex items-center text-ottoman-gold text-sm font-semibold">
                      Ürünleri İncele
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/orders">
              <div className="card-ottoman hover:border-ottoman-gold/40 transition-all cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Siparişlerim
                    </h3>
                    <p className="text-sm text-ottoman-cream/70 mb-3">
                      Tüm siparişlerinizi görüntüleyin
                    </p>
                    <div className="flex items-center text-ottoman-gold text-sm font-semibold">
                      Siparişleri Gör
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/profile">
              <div className="card-ottoman hover:border-ottoman-gold/40 transition-all cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Profil Bilgileri
                    </h3>
                    <p className="text-sm text-ottoman-cream/70 mb-3">
                      Bayi bilgilerinizi güncelleyin
                    </p>
                    <div className="flex items-center text-ottoman-gold text-sm font-semibold">
                      Profili Düzenle
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          className="card-ottoman"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-white">
              Son Siparişler
            </h2>
            <Link href="/orders" className="text-ottoman-gold hover:text-ottoman-gold/80 text-sm font-semibold">
              Tümünü Gör →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
              <p className="text-ottoman-cream/70">Henüz sipariş bulunmuyor</p>
              <Link href="/products" className="btn-ottoman mt-4">
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <Link key={order._id} href={`/order-confirmation/${order._id}`}>
                  <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-ottoman-gold/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-ottoman-gold" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Sipariş #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-ottoman-cream/60">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-ottoman-gold font-semibold">
                        ₺{order.totalAmount.toLocaleString('tr-TR')}
                      </p>
                      <p className="text-sm text-ottoman-cream/60 capitalize">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Dealer Info Section */}
        <motion.div
          className="card-ottoman mt-8 bg-gradient-to-br from-white/5 to-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-start gap-4">
            <BarChart3 className="w-6 h-6 text-ottoman-gold flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Bayi Seviyenizi Yükseltin
              </h3>
              <p className="text-ottoman-cream/80 text-sm mb-4">
                Daha fazla sipariş vererek bayi seviyenizi yükseltebilir ve daha iyi fiyatlandırmadan faydalanabilirsiniz.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-400 mb-1">Küçük Bayi</p>
                  <p className="text-sm text-white font-semibold">%5-10 İndirim</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-xs text-green-400 mb-1">Orta Bayi</p>
                  <p className="text-sm text-white font-semibold">%10-15 İndirim</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <p className="text-xs text-purple-400 mb-1">Büyük Bayi</p>
                  <p className="text-sm text-white font-semibold">%15-20 İndirim</p>
                </div>
                <div className="bg-ottoman-gold/10 border border-ottoman-gold/20 rounded-lg p-3">
                  <p className="text-xs text-ottoman-gold mb-1">Ana Bayi</p>
                  <p className="text-sm text-white font-semibold">%20-25 İndirim</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
