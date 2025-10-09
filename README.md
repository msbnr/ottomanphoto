# Ottoman Platform

**Franchise tabanlı B2B/B2C Hybrid E-ticaret Platformu**

İki kanallı satış sistemi ile hem son kullanıcılara (B2C) hem de bayilere (B2B) hizmet veren modern e-ticaret platformu.

## 🎯 Proje Özellikleri

### Core Features

- ✅ **İki Kanallı Satış**: Son kullanıcılar ve bayiler için ayrı deneyim
- ✅ **5 Seviyeli Fiyatlandırma**: Retail, Small Dealer, Medium Dealer, Large Dealer, Main Dealer
- ✅ **Dinamik Görünürlük Kontrolü**: Ürünler kullanıcı tipine göre filtrelenir
- ✅ **JWT Authentication**: Güvenli kimlik doğrulama sistemi
- ✅ **Rol Tabanlı Yetkilendirme**: Customer, Dealer, Admin, Supplier rolleri
- ✅ **Sipariş Yönetimi**: Tam özellikli e-ticaret sipariş sistemi
- ✅ **Franchise Başvuru**: Online franchise başvuru formu
- ✅ **Admin Panel Hazır**: Kategori, ürün, sipariş, bayi yönetimi

### Gelecek Özellikler (Roadmap)

- ⏳ Next.js Frontend (Phase 2)
- ⏳ XML Ürün Import
- ⏳ Pazar Yeri Entegrasyonları (Trendyol, Hepsiburada, N11)
- ⏳ Ödeme Gateway (iyzico, PayTR)
- ⏳ Email Bildirimleri
- ⏳ Redis Cache
- ⏳ File Upload (Ürün görselleri)

## 🏗️ Teknoloji Stack

### Backend (✅ Tamamlandı)
- **Node.js** + **TypeScript**
- **Express.js** - REST API
- **MongoDB** + **Mongoose** - NoSQL Database
- **JWT** - Authentication
- **bcryptjs** - Password Encryption
- **express-validator** - Validation
- **helmet** - Security
- **rate-limit** - Rate Limiting

### Frontend (⏳ Planlanan)
- **Next.js 14+** - React Framework
- **TypeScript**
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Query** - Data Fetching
- **React Hook Form** - Form Management

## 📁 Proje Yapısı

```
ottoman-platform/
├── backend/              ✅ TAMAMLANDI
│   ├── src/
│   │   ├── config/       # Database, env config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Helper functions
│   │   └── server.ts     # Main entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/             ⏳ PLANLANAN
    ├── app/              # Next.js 14 app directory
    ├── components/       # React components
    ├── lib/             # Utilities
    ├── public/          # Static assets
    └── package.json
```

## 🚀 Hızlı Başlangıç

### 1. Backend Kurulumu

```bash
cd backend
npm install

# .env dosyasını yapılandır
cp .env.example .env
# MongoDB bağlantı bilgilerini .env'ye ekle

# Development modda başlat
npm run dev
```

Backend şu adreste çalışacak: http://localhost:5000

Detaylı kurulum için: [backend/README.md](./backend/README.md)

### 2. MongoDB Kurulumu

**Local MongoDB:**
```bash
# MongoDB'yi başlat
mongod
```

**MongoDB Atlas (Cloud - Önerilen):**
1. https://www.mongodb.com/cloud/atlas
2. Ücretsiz cluster oluştur
3. Connection string'i al
4. `.env` dosyasına ekle

### 3. İlk Admin Kullanıcısı Oluşturma

API çalıştıktan sonra:

```bash
curl -X POST http://localhost:5000/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ottoman.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

Ardından MongoDB'de bu kullanıcının `userType`'ını `admin` olarak güncelleyin.

## 📚 API Dokümantasyonu

### Health Check
```
GET /health
```

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/customer` | Müşteri kaydı |
| POST | `/api/auth/register/dealer` | Bayi kaydı |
| POST | `/api/auth/login` | Giriş |
| GET | `/api/auth/profile` | Profil bilgileri 🔒 |
| PUT | `/api/auth/profile` | Profil güncelleme 🔒 |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Ürün listesi (fiyatlar kullanıcıya göre) |
| GET | `/api/products/:id` | Ürün detayı |
| POST | `/api/products` | Ürün ekle 🔒 Admin/Supplier |
| PUT | `/api/products/:id` | Ürün güncelle 🔒 Admin/Supplier |
| DELETE | `/api/products/:id` | Ürün sil 🔒 Admin |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Sipariş oluştur 🔒 |
| GET | `/api/orders/my-orders` | Siparişlerim 🔒 |
| GET | `/api/orders/:id` | Sipariş detayı 🔒 |
| GET | `/api/orders` | Tüm siparişler 🔒 Admin |
| PATCH | `/api/orders/:id/status` | Durum güncelle 🔒 Admin |

### Franchise
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/franchise/apply` | Başvuru yap |
| GET | `/api/franchise` | Tüm başvurular 🔒 Admin |
| GET | `/api/franchise/:id` | Başvuru detayı 🔒 Admin |
| PATCH | `/api/franchise/:id/status` | Durum güncelle 🔒 Admin |

🔒 = Authentication gerekli

Detaylı API dokümantasyonu: [backend/README.md](./backend/README.md)

## 💰 Fiyatlandırma Mantığı

Sistem, kullanıcı tipine göre otomatik fiyat gösterir:

| Kullanıcı Tipi | Görünen Fiyat | Örnek |
|----------------|---------------|-------|
| **Customer** | Retail | 100 TL |
| **Dealer (Small)** | dealer_small | 85 TL |
| **Dealer (Medium)** | dealer_medium | 80 TL |
| **Dealer (Large)** | dealer_large | 75 TL |
| **Dealer (Main)** | dealer_main | 70 TL |

## 🎨 Kullanıcı Akışları

### Son Kullanıcı Akışı
1. Kayıt ol (isim, email, şifre, telefon)
2. Ürünleri gör (retail fiyatlarıyla)
3. Sepete ekle
4. Sipariş ver
5. Siparişleri takip et

### Bayi Akışı
1. Bayi kaydı (firma bilgileri, vergi no)
2. Ürünleri gör (bayi fiyatlarıyla)
3. Toplu sipariş ver
4. Özel fiyat avantajları

### Admin Akışı
1. Ürün yönetimi (CRUD)
2. Sipariş yönetimi
3. Bayi yönetimi
4. Franchise başvuruları
5. Raporlama

## 🔐 Güvenlik

- ✅ Bcrypt password hashing
- ✅ JWT token authentication
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ MongoDB injection prevention

## 📈 Gelecek Geliştirmeler

### Phase 2: Frontend (Planlanan)
- [ ] Next.js 14 kurulumu
- [ ] Ana sayfa ve ürün listesi
- [ ] Sepet ve checkout
- [ ] Kullanıcı/bayi paneli
- [ ] Admin dashboard

### Phase 3: Entegrasyonlar
- [ ] XML ürün import
- [ ] Trendyol API
- [ ] Hepsiburada API
- [ ] N11 API
- [ ] İyzico ödeme
- [ ] Email servisi (SendGrid)

### Phase 4: Optimizasyon
- [ ] Redis cache
- [ ] CDN entegrasyonu
- [ ] Image optimization
- [ ] SEO optimization
- [ ] Performance monitoring

## 🧪 Test

```bash
# Unit tests (yakında)
npm test

# Integration tests (yakında)
npm run test:integration

# E2E tests (yakında)
npm run test:e2e
```

## 📝 Environment Variables

Backend için gerekli `.env` değişkenleri:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ottoman-platform

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (gelecek)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# Payment (gelecek)
PAYMENT_API_KEY=
```

## 🤝 Katkıda Bulunma

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

Proje Sahibi - [email protected]

## 🙏 Teşekkürler

Bu proje Claude Code (Anthropic) ile geliştirilmiştir.

---

**Not**: Bu proje aktif geliştirme aşamasındadır. Backend Phase 1 tamamlanmıştır. Frontend geliştirme aşaması yakında başlayacaktır.
