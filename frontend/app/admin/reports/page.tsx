'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, DollarSign, Package, Users, ShoppingCart, Download, Filter } from 'lucide-react'

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  })

  const [reportType, setReportType] = useState<'sales' | 'products' | 'customers' | 'carts'>('sales')

  // Mock data
  const stats = {
    totalSales: 1234567,
    totalOrders: 456,
    totalCustomers: 89,
    averageOrderValue: 2705,
    topProducts: [
      { id: '1', name: 'HP LaserJet Pro Yazıcı', sold: 45, revenue: 225000 },
      { id: '2', name: 'Dell Latitude 5420 Laptop', sold: 12, revenue: 300000 },
      { id: '3', name: 'Ergonomik Ofis Koltuğu', sold: 38, revenue: 133000 },
      { id: '4', name: 'A4 Fotokopi Kağıdı', sold: 120, revenue: 54000 },
      { id: '5', name: 'HP Toner Kartuş 85A', sold: 85, revenue: 63750 },
    ],
    topCustomers: [
      { id: '1', name: 'Mehmet Yılmaz', email: 'mehmet@example.com', orders: 12, spent: 145000 },
      { id: '2', name: 'Ayşe Demir', email: 'ayse@example.com', orders: 8, spent: 98000 },
      { id: '3', name: 'Ali Kaya', email: 'ali@example.com', orders: 10, spent: 87500 },
      { id: '4', name: 'Fatma Şahin', email: 'fatma@example.com', orders: 6, spent: 72000 },
      { id: '5', name: 'Ahmet Çelik', email: 'ahmet@example.com', orders: 7, spent: 65000 },
    ],
    cartActivity: [
      { userId: '1', userName: 'Zeynep Arslan', items: 3, total: 15500, addedAt: '2024-01-28T14:30:00' },
      { userId: '2', userName: 'Burak Özkan', items: 2, total: 8900, addedAt: '2024-01-28T12:15:00' },
      { userId: '3', userName: 'Selin Yıldız', items: 5, total: 22300, addedAt: '2024-01-27T18:45:00' },
      { userId: '4', userName: 'Can Aydın', items: 1, total: 5000, addedAt: '2024-01-27T16:20:00' },
      { userId: '5', userName: 'Deniz Kılıç', items: 4, total: 18750, addedAt: '2024-01-26T10:00:00' },
    ],
  }

  const handleExport = (type: string) => {
    // TODO: Implement export functionality
    alert(`${type} raporu indiriliyor...`)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              <span className="bg-gradient-to-r from-ottoman-gold to-ottoman-gold-light bg-clip-text text-transparent">
                Raporlar ve Analitik
              </span>
            </h1>
            <p className="text-ottoman-cream/70">
              Detaylı satış ve müşteri raporları
            </p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="card-ottoman mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-ottoman-cream mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                className="input-ottoman"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-ottoman-cream mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Bitiş Tarihi
              </label>
              <input
                type="date"
                className="input-ottoman"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <button className="btn-ottoman flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtrele</span>
            </button>
            <button
              onClick={() => handleExport('genel')}
              className="btn-ottoman-outline flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Excel İndir</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="card-ottoman text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 bg-ottoman-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-ottoman-gold" />
            </div>
            <div className="text-3xl font-bold text-ottoman-gold mb-2">
              {stats.totalSales.toLocaleString('tr-TR')} ₺
            </div>
            <div className="text-sm text-ottoman-cream/70">Toplam Satış</div>
          </motion.div>

          <motion.div
            className="card-ottoman text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500 mb-2">
              {stats.totalOrders}
            </div>
            <div className="text-sm text-ottoman-cream/70">Toplam Sipariş</div>
          </motion.div>

          <motion.div
            className="card-ottoman text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {stats.totalCustomers}
            </div>
            <div className="text-sm text-ottoman-cream/70">Aktif Müşteri</div>
          </motion.div>

          <motion.div
            className="card-ottoman text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {stats.averageOrderValue.toLocaleString('tr-TR')} ₺
            </div>
            <div className="text-sm text-ottoman-cream/70">Ortalama Sepet</div>
          </motion.div>
        </div>

        {/* Report Type Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setReportType('sales')}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                reportType === 'sales'
                  ? 'bg-ottoman-gold text-ottoman-black'
                  : 'bg-ottoman-gold/10 text-ottoman-cream hover:bg-ottoman-gold/20'
              }`}
            >
              Satış Raporu
            </button>
            <button
              onClick={() => setReportType('products')}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                reportType === 'products'
                  ? 'bg-ottoman-gold text-ottoman-black'
                  : 'bg-ottoman-gold/10 text-ottoman-cream hover:bg-ottoman-gold/20'
              }`}
            >
              En Çok Satanlar
            </button>
            <button
              onClick={() => setReportType('customers')}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                reportType === 'customers'
                  ? 'bg-ottoman-gold text-ottoman-black'
                  : 'bg-ottoman-gold/10 text-ottoman-cream hover:bg-ottoman-gold/20'
              }`}
            >
              Değerli Müşteriler
            </button>
            <button
              onClick={() => setReportType('carts')}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                reportType === 'carts'
                  ? 'bg-ottoman-gold text-ottoman-black'
                  : 'bg-ottoman-gold/10 text-ottoman-cream hover:bg-ottoman-gold/20'
              }`}
            >
              Sepet Takibi
            </button>
          </div>
        </div>

        {/* Top Products Report */}
        {reportType === 'products' && (
          <div className="card-ottoman">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-ottoman-gold">
                En Çok Satan Ürünler
              </h2>
              <button
                onClick={() => handleExport('urunler')}
                className="btn-ottoman-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>İndir</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ottoman-gold/20">
                    <th className="text-left p-4 text-ottoman-gold font-semibold">Sıra</th>
                    <th className="text-left p-4 text-ottoman-gold font-semibold">Ürün Adı</th>
                    <th className="text-right p-4 text-ottoman-gold font-semibold">Satış Adedi</th>
                    <th className="text-right p-4 text-ottoman-gold font-semibold">Toplam Ciro</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map((product, index) => (
                    <tr key={product.id} className="border-b border-ottoman-gold/10 hover:bg-ottoman-gold/5">
                      <td className="p-4">
                        <span className="text-2xl font-bold text-ottoman-gold/50">
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-ottoman-cream font-medium">{product.name}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-ottoman-cream">{product.sold} adet</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-ottoman-gold font-semibold">
                          {product.revenue.toLocaleString('tr-TR')} ₺
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Customers Report */}
        {reportType === 'customers' && (
          <div className="card-ottoman">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-ottoman-gold">
                En Değerli Müşteriler
              </h2>
              <button
                onClick={() => handleExport('musteriler')}
                className="btn-ottoman-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>İndir</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ottoman-gold/20">
                    <th className="text-left p-4 text-ottoman-gold font-semibold">Sıra</th>
                    <th className="text-left p-4 text-ottoman-gold font-semibold">Müşteri</th>
                    <th className="text-right p-4 text-ottoman-gold font-semibold">Sipariş Sayısı</th>
                    <th className="text-right p-4 text-ottoman-gold font-semibold">Toplam Harcama</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topCustomers.map((customer, index) => (
                    <tr key={customer.id} className="border-b border-ottoman-gold/10 hover:bg-ottoman-gold/5">
                      <td className="p-4">
                        <span className="text-2xl font-bold text-ottoman-gold/50">
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-ottoman-cream font-medium">{customer.name}</div>
                          <div className="text-xs text-ottoman-cream/50">{customer.email}</div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-ottoman-cream">{customer.orders} sipariş</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-ottoman-gold font-semibold">
                          {customer.spent.toLocaleString('tr-TR')} ₺
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cart Activity Report */}
        {reportType === 'carts' && (
          <div className="card-ottoman">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-ottoman-gold">
                Sepet Aktivitesi
              </h2>
              <button
                onClick={() => handleExport('sepetler')}
                className="btn-ottoman-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>İndir</span>
              </button>
            </div>
            <p className="text-ottoman-cream/70 mb-4">
              Kullanıcıların sepetlerine eklediği ancak henüz satın almadığı ürünler
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ottoman-gold/20">
                    <th className="text-left p-4 text-ottoman-gold font-semibold">Kullanıcı</th>
                    <th className="text-right p-4 text-ottoman-gold font-semibold">Ürün Sayısı</th>
                    <th className="text-right p-4 text-ottoman-gold font-semibold">Sepet Tutarı</th>
                    <th className="text-right p-4 text-ottoman-gold font-semibold">Eklenme Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.cartActivity.map((cart) => (
                    <tr key={cart.userId} className="border-b border-ottoman-gold/10 hover:bg-ottoman-gold/5">
                      <td className="p-4">
                        <span className="text-ottoman-cream font-medium">{cart.userName}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-ottoman-cream">{cart.items} ürün</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-ottoman-gold font-semibold">
                          {cart.total.toLocaleString('tr-TR')} ₺
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-ottoman-cream/70 text-sm">
                          {new Date(cart.addedAt).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
