# 🏺 Ottoman Platform

**Modern Full-Stack E-Ticaret Platformu**

Franchise tabanlı B2B/B2C hybrid e-ticaret sistemi. Next.js 14, Express.js ve MongoDB ile geliştirilmiş, production-ready platform.

## ✨ Proje Özellikleri

### ✅ Tamamlanan Özellikler

**E-Ticaret Core**
- ✅ **5 Seviyeli Fiyatlandırma**: Retail, Small Dealer, Medium Dealer, Large Dealer, Main Dealer
- ✅ **Ürün Yönetimi**: Kategoriler, stok takibi, çoklu resim desteği
- ✅ **Sepet Sistemi**: Tam özellikli alışveriş sepeti (Zustand state management)
- ✅ **Sipariş Yönetimi**: Sipariş oluşturma, takip, durum güncelleme
- ✅ **Ödeme Entegrasyonu**: Iyzico hazır (aktif edilebilir)

**Kullanıcı Yönetimi**
- ✅ **JWT Authentication**: Güvenli kimlik doğrulama
- ✅ **4 Kullanıcı Rolü**: Customer, Dealer, Admin, Franchise
- ✅ **Profil Yönetimi**: Kullanıcı bilgileri, adres yönetimi
- ✅ **Bayi Sistemi**: Seviye bazlı özel fiyatlandırma

**CMS & İçerik**
- ✅ **Dinamik Sayfa Oluşturucu**: SEO-friendly slug'lar
- ✅ **Banner Yönetimi**: Carousel slider, responsive tasarım
- ✅ **Galeri Sistemi**: Albüm ve görsel yönetimi
- ✅ **İletişim Formu**: Mesaj yönetimi

**Admin Paneli**
- ✅ **Dashboard**: İstatistikler ve raporlar
- ✅ **Ürün Yönetimi**: CRUD işlemleri, toplu işlemler
- ✅ **Sipariş Takibi**: Durum güncelleme, detaylı görünüm
- ✅ **Kullanıcı Yönetimi**: Roller, yetkilendirme
- ✅ **CMS Kontrol Paneli**: Sayfa, banner, galeri yönetimi
- ✅ **Franchise Başvuruları**: Başvuru formu ve yönetim

**Frontend (Next.js 14)**
- ✅ **App Router**: Modern Next.js architecture
- ✅ **Responsive Design**: Mobil-first yaklaşım
- ✅ **Framer Motion**: Smooth animasyonlar
- ✅ **Tailwind CSS**: Utility-first styling
- ✅ **SEO Optimized**: Meta tags, OpenGraph

### 🚀 Gelecek Özellikler

- ⏳ Pazar Yeri Entegrasyonları (Trendyol, Hepsiburada, N11)
- ⏳ Email Bildirimleri (Sipariş, kayıt vs.)
- ⏳ SMS Entegrasyonu
- ⏳ Redis Cache Layer
- ⏳ Advanced Analytics Dashboard
- ⏳ Multi-language Support (i18n)

## 🏗️ Teknoloji Stack

### Backend (✅ Production Ready)
- **Node.js 18+** + **TypeScript**
- **Express.js** - REST API
- **MongoDB** + **Mongoose** - NoSQL Database
- **JWT** - Authentication & Authorization
- **bcryptjs** - Password Hashing
- **helmet** - HTTP Security Headers
- **rate-limiter** - DDoS Protection
- **multer** - File Upload
- **express-validator** - Input Validation

### Frontend (✅ Production Ready)
- **Next.js 14** - App Router
- **React 18** + **TypeScript**
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - Lightweight State Management
- **Axios** - HTTP Client
- **Framer Motion** - Animations
- **React Icons** - Icon Library

## 📁 Proje Yapısı

```
ottoman-platform/
├── backend/                    ✅ Production Ready
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # API controllers
│   │   ├── middleware/        # Auth, error handling, upload
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   └── server.ts          # Express app entry
│   ├── uploads/               # File uploads directory
│   ├── railway.json           # Railway deployment config
│   └── package.json
│
├── frontend/                   ✅ Production Ready
│   ├── app/                   # Next.js 14 App Router
│   │   ├── admin/            # Admin panel pages
│   │   ├── products/         # Product pages
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout flow
│   │   └── ...
│   ├── components/           # React components
│   ├── store/               # Zustand state stores
│   ├── lib/                 # Utilities
│   ├── public/              # Static assets
│   ├── railway.json         # Railway deployment config
│   └── package.json
│
├── WEB/                       # VPS deployment package
│   ├── backend/              # Compiled backend
│   ├── frontend/             # Built frontend
│   ├── KURULUM_TALİMATI.txt  # VPS setup guide
│   ├── mongo_talimat.txt     # MongoDB guide
│   └── README.txt
│
├── RAILWAY_DEPLOYMENT.md      # Railway full guide
├── RAILWAY_HIZLI_BASLANGIC.md # Railway quick start
├── CLOUDFLARE_DNS.md          # DNS setup guide
└── README.md                  # This file
```

## 🚀 Deployment Seçenekleri

### 1️⃣ Railway.app (ÖNERİLEN - Ücretsiz Hosting)

En hızlı ve kolay deployment. Backend, Frontend ve MongoDB tek platformda!

**Avantajları**:
- ✅ Ücretsiz $5 kredi/ay (~500 saat)
- ✅ MongoDB dahil (ayrı servis gerekmez)
- ✅ Otomatik SSL sertifikası
- ✅ GitHub entegrasyonu (her push otomatik deploy)
- ✅ 15 dakikada yayında!

**Rehberler**:
- 📖 [RAILWAY_HIZLI_BASLANGIC.md](./RAILWAY_HIZLI_BASLANGIC.md) - **15 dakikada başla!**
- 📖 [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Detaylı 14 adımlı rehber
- 📖 [CLOUDFLARE_DNS.md](./CLOUDFLARE_DNS.md) - Custom domain bağlama

### 2️⃣ VPS/Sunucu (Production Ortamı)

Kendi sunucunuzda tam kontrol.

**Sistem Gereksinimleri**:
- Ubuntu/Debian 20.04+
- Node.js 18+
- MongoDB 5.0+
- 2GB RAM (4GB önerilir)
- 20GB disk

**Rehberler**:
- 📖 [WEB/KURULUM_TALİMATI.txt](./WEB/KURULUM_TALİMATI.txt) - 15 adımlı sunucu kurulum
- 📖 [WEB/mongo_talimat.txt](./WEB/mongo_talimat.txt) - MongoDB kurulum
- 📖 [WEB/DOSYA_YAPISI.txt](./WEB/DOSYA_YAPISI.txt) - Proje yapısı

### 3️⃣ Lokal Geliştirme

**Gereksinimler**:
- Node.js 18+
- MongoDB 5.0+

**Kurulum**:

```bash
# 1. Backend Kurulum
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin (MongoDB URI, JWT_SECRET)

npm run dev
# Backend: http://localhost:5000

# 2. Frontend Kurulum (yeni terminal)
cd frontend
npm install
cp .env.local.example .env.local
# .env.local dosyasını düzenleyin (API URL)

npm run dev
# Frontend: http://localhost:3000
```

**İlk Admin Oluşturma**:
1. http://localhost:3000/register adresinden kayıt olun
2. MongoDB'de o kullanıcının `userType`'ını `admin` yapın

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

## 🔐 Güvenlik Özellikleri

Projede aktif güvenlik önlemleri:

- ✅ **Authentication**: JWT token tabanlı kimlik doğrulama
- ✅ **Password Security**: Bcrypt hashing (salt rounds: 10)
- ✅ **HTTP Security**: Helmet.js middleware
- ✅ **CORS Protection**: Yapılandırılabilir origin kontrolü
- ✅ **Rate Limiting**: 100 istek/15 dakika (DDoS koruması)
- ✅ **Input Validation**: Express-validator ile
- ✅ **NoSQL Injection**: Mongoose built-in koruması
- ✅ **File Upload Security**: Type ve size kontrolü
- ✅ **XSS Protection**: Input sanitization

**Production Önerileri**:
- 🔒 JWT_SECRET: En az 32 karakter, güçlü key
- 🔒 HTTPS: SSL sertifikası mutlaka kullanın
- 🔒 MongoDB: Authentication aktif edin
- 🔒 Firewall: Gereksiz portları kapatın
- 🔒 Backup: Düzenli yedek alın

## 📊 Performans & Optimizasyon

### Frontend
- ✅ Next.js Image Optimization (automatic)
- ✅ Code Splitting (automatic)
- ✅ Static Page Generation
- ✅ Lazy Loading
- ✅ Framer Motion animations

### Backend
- ✅ MongoDB Indexing (email, slug, sku)
- ✅ Compression Middleware
- ✅ Connection Pooling
- ✅ Response Caching (hazır)

## 🧪 Test & Quality

```bash
# Type checking
npm run type-check

# Lint (ESLint)
npm run lint

# Production build test
npm run build
```

**TODO**:
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Cypress/Playwright)
- [ ] API tests (Postman/Newman)

## 📈 Roadmap

### v1.1 (Sonraki)
- [ ] Email notification sistemi
- [ ] SMS entegrasyonu (Netgsm/İletimerkezi)
- [ ] Advanced search & filtering
- [ ] Wishlist/Favorites
- [ ] Product reviews & ratings

### v1.2
- [ ] Marketplace entegrasyonları (Trendyol, HB, N11)
- [ ] XML product import/export
- [ ] Advanced analytics dashboard
- [ ] Multi-warehouse support

### v2.0
- [ ] Redis cache layer
- [ ] Multi-language (i18n)
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced reporting

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

## 🚀 Otomatik Deployment (Railway)

Railway ile GitHub entegrasyonu sayesinde her push otomatik deploy tetikler:

```bash
# Kod değişikliği yapın
git add .
git commit -m "feat: Yeni özellik eklendi"
git push origin main

# Railway otomatik olarak:
# 1. Değişiklikleri algılar
# 2. Backend ve Frontend'i ayrı ayrı build eder
# 3. ~2-3 dakika içinde canlıya alır
# 4. Deployment loglarını gösterir
```

**Auto-deploy'u durdurmak için**:
Railway Dashboard → Servis → Settings → Disable Auto Deploy

## 🤝 Katkıda Bulunma

1. Projeyi fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

**Commit Convention**:
- `feat:` Yeni özellik
- `fix:` Bug düzeltme
- `docs:` Dokümantasyon
- `style:` Kod formatı
- `refactor:` Kod refactoring
- `test:` Test ekleme
- `chore:` Konfigürasyon

## 📄 Lisans

Bu proje özel bir projedir. Ticari kullanım için izin gereklidir.

## 📞 Destek & İletişim

**Proje Sahibi**: Veyaz Ottoman Platform Team

**Deployment Sorunları**:
- Railway: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md#sorun-giderme)
- VPS: [WEB/KURULUM_TALİMATI.txt](./WEB/KURULUM_TALİMATI.txt)
- DNS: [CLOUDFLARE_DNS.md](./CLOUDFLARE_DNS.md#sorun-giderme)

**Yararlı Linkler**:
- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app/
- Cloudflare Docs: https://developers.cloudflare.com/

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak teknolojiler kullanılarak geliştirilmiştir:

- [Next.js](https://nextjs.org/) - React Framework
- [Express.js](https://expressjs.com/) - Node.js Framework
- [MongoDB](https://www.mongodb.com/) - NoSQL Database
- [Railway](https://railway.app/) - Deployment Platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management

**Geliştirme Desteği**: Claude Code (Anthropic)

---

## ✅ Production Ready!

**Ottoman Platform v1.0** production ortamı için hazır!

🎉 **Hemen başla**:
- 🚂 Railway ile 15 dakikada yayınla: [RAILWAY_HIZLI_BASLANGIC.md](./RAILWAY_HIZLI_BASLANGIC.md)
- 🖥️ Kendi sunucuna kur: [WEB/KURULUM_TALİMATI.txt](./WEB/KURULUM_TALİMATI.txt)
- 💻 Lokal geliştir: `npm run dev` (backend & frontend)

**Site Özellikleri**:
- 🌐 Modern responsive tasarım
- 🛒 Tam özellikli e-ticaret
- 👤 4 kullanıcı rolü (customer, dealer, admin, franchise)
- 📊 Admin paneli
- 🎨 CMS sistemi
- 🔒 Enterprise-level güvenlik
- ⚡ Performans optimize edilmiş

**Başarılar!** 🚀

---

**Son Güncelleme**: 31 Ekim 2024
**Versiyon**: 1.0
**Status**: ✅ Production Ready
**Framework**: Next.js 14 + Express.js
**Database**: MongoDB
**Deployment**: Railway / VPS
