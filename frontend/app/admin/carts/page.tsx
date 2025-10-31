'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Search } from 'lucide-react'

// Mock data - Will be connected to API when backend is developed
const mockCarts = [
  {
    id: '1',
    user: {
      name: 'Ahmet Yilmaz',
      email: 'ahmet@example.com',
    },
    items: [
      { productName: 'Premium Laser Printer', quantity: 2, price: 5000 },
      { productName: 'A4 Copy Paper', quantity: 5, price: 450 },
    ],
    totalAmount: 12250,
    createdAt: '2024-01-15T10:30:00',
    lastUpdated: '2024-01-16T14:20:00',
  },
  {
    id: '2',
    user: {
      name: 'Mehmet Demir',
      email: 'mehmet@example.com',
    },
    items: [
      { productName: 'Dell Latitude 5420 Laptop', quantity: 1, price: 25000 },
    ],
    totalAmount: 25000,
    createdAt: '2024-01-14T09:15:00',
    lastUpdated: '2024-01-14T09:15:00',
  },
]

export default function AdminCartsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCarts = mockCarts.filter(cart =>
    cart.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cart.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              Sepette Bekleyen Ürünler
            </h1>
          </div>
          <p className="text-ottoman-cream/70">
            Müşteri sepetlerinde bekleyen ürünleri görüntüle
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
            <input
              type="text"
              placeholder="Müşteri adı veya e-posta ile ara..."
              className="input-ottoman pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Carts List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCarts.map((cart, index) => (
            <motion.div
              key={cart.id}
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {cart.user.name}
                  </h3>
                  <p className="text-sm text-ottoman-cream/60">{cart.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-ottoman-cream">
                    {cart.totalAmount.toLocaleString('tr-TR')} TL
                  </p>
                  <p className="text-xs text-ottoman-cream/50">
                    {cart.items.length} ürün
                  </p>
                </div>
              </div>

              <div className="divider-ottoman my-4"></div>

              <div className="space-y-3">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-ottoman-cream font-medium">{item.productName}</p>
                      <p className="text-sm text-ottoman-cream/60">
                        {item.quantity} adet x {item.price.toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                    <p className="text-white font-semibold">
                      {(item.quantity * item.price).toLocaleString('tr-TR')} TL
                    </p>
                  </div>
                ))}
              </div>

              <div className="divider-ottoman my-4"></div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-ottoman-cream/60">
                    Oluşturulma: {new Date(cart.createdAt).toLocaleString('tr-TR')}
                  </p>
                  <p className="text-ottoman-cream/60">
                    Son Güncelleme: {new Date(cart.lastUpdated).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-ottoman-outline btn-sm">
                    Detaylar
                  </button>
                  <button className="btn-ottoman btn-sm">
                    İletişim
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCarts.length === 0 && (
          <div className="card-ottoman text-center py-12">
            <ShoppingCart className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60">
              {searchTerm ? 'Sonuç bulunamadı' : 'Henüz sepette bekleyen ürünü olan müşteri yok'}
            </p>
          </div>
        )}

        <div className="mt-6">
          <p className="text-ottoman-cream/70 text-sm">
            Toplam {filteredCarts.length} sepet gösteriliyor
          </p>
          <p className="text-ottoman-cream/50 text-xs mt-2">
            * Bu sayfa örnek veri kullanıyor. Backend entegrasyonu için sepet API&apos;si geliştirilmesi gerekiyor.
          </p>
        </div>
      </div>
    </div>
  )
}
