'use client'

import { motion } from 'framer-motion'
import {
  Users, Package, ShoppingCart, TrendingUp,
  FileText, Settings, BarChart3, DollarSign, Image as ImageIcon, ImagePlus, Folder, CreditCard, Award, LineChart
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    name: 'Toplam Satış',
    value: '₺1,234,567',
    change: '+12.5%',
    icon: DollarSign,
    color: 'text-green-500'
  },
  {
    name: 'Siparişler',
    value: '1,234',
    change: '+8.2%',
    icon: ShoppingCart,
    color: 'text-blue-500'
  },
  {
    name: 'Ürünler',
    value: '567',
    change: '+5.1%',
    icon: Package,
    color: 'text-purple-500'
  },
  {
    name: 'Kullanıcılar',
    value: '89',
    change: '+15.3%',
    icon: Users,
    color: 'text-white'
  },
]

const quickActions = [
  {
    name: 'Ürün Yönetimi',
    description: 'Ürünleri ekle, düzenle ve sil',
    icon: Package,
    href: '/admin/products',
    color: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40'
  },
  {
    name: 'Banner Yönetimi',
    description: 'Anasayfa banner\'larını yönet',
    icon: ImageIcon,
    href: '/admin/banners',
    color: 'bg-pink-500/10 border-pink-500/20 hover:border-pink-500/40'
  },
  {
    name: 'Galeri Yönetimi',
    description: 'Fotoğraf, video ve albüm yönetimi',
    icon: ImagePlus,
    href: '/admin/gallery',
    color: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40'
  },
  {
    name: 'Sipariş Yönetimi',
    description: 'Siparişleri görüntüle ve yönet',
    icon: ShoppingCart,
    href: '/admin/orders',
    color: 'bg-green-500/10 border-green-500/20 hover:border-green-500/40'
  },
  {
    name: 'Kullanıcılar',
    description: 'Müşteri ve bayi yönetimi',
    icon: Users,
    href: '/admin/users',
    color: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40'
  },
  {
    name: 'Franchise Başvuruları',
    description: 'Başvuruları incele ve onayla',
    icon: FileText,
    href: '/admin/franchise',
    color: 'bg-white/10 border-white/20 hover:border-white/40'
  },
  {
    name: 'Franchise Özellikleri',
    description: 'Franchise avantajlarını yönet',
    icon: Award,
    href: '/admin/franchise-features',
    color: 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40'
  },
  {
    name: 'Franchise İstatistikleri',
    description: 'Franchise sayısal verilerini yönet',
    icon: LineChart,
    href: '/admin/franchise-stats',
    color: 'bg-teal-500/10 border-teal-500/20 hover:border-teal-500/40'
  },
  {
    name: 'İçerik Yönetimi (CMS)',
    description: 'Sayfa içeriklerini düzenle',
    icon: FileText,
    href: '/admin/cms',
    color: 'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40'
  },
  {
    name: 'Sepette Bekleyen Ürünler',
    description: 'Müşteri sepetlerini görüntüle',
    icon: ShoppingCart,
    href: '/admin/carts',
    color: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40'
  },
  {
    name: 'Ayarlar',
    description: 'Sistem ayarları ve yapılandırma',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500/10 border-gray-500/20 hover:border-gray-500/40'
  },
  {
    name: 'Ödeme Yönetimi',
    description: 'Ödeme ayarları ve entegrasyonları',
    icon: CreditCard,
    href: '/admin/payment-settings',
    color: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40'
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-serif font-bold mb-2">
            <span className="text-white">
              Yönetim Paneli
            </span>
          </h1>
          <p className="text-ottoman-cream/70">
            Ottoman Platform yönetim ve kontrol merkezi
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-green-500 font-semibold">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ottoman-cream mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-ottoman-cream/60">{stat.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.name}
                href={action.href}
              >
                <motion.div
                  className={`card-ottoman border ${action.color} cursor-pointer h-full`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ottoman-cream mb-1">
                        {action.name}
                      </h3>
                      <p className="text-sm text-ottoman-cream/60">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Son Aktiviteler
          </h2>
          <div className="card-ottoman">
            <div className="space-y-4">
              {[
                { action: 'Yeni sipariş', detail: '#1234 - Ahmet Yılmaz', time: '5 dakika önce' },
                { action: 'Ürün güncellendi', detail: 'Premium Lazer Yazıcı', time: '15 dakika önce' },
                { action: 'Franchise başvurusu', detail: 'Mehmet Demir - Ankara', time: '1 saat önce' },
                { action: 'Yeni kullanıcı', detail: 'customer@example.com', time: '2 saat önce' },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                >
                  <div>
                    <p className="text-ottoman-cream font-medium">{activity.action}</p>
                    <p className="text-sm text-ottoman-cream/60">{activity.detail}</p>
                  </div>
                  <span className="text-sm text-ottoman-cream/50">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
