# Ottoman Platform - Backend API

Franchise tabanlı B2B/B2C hybrid e-ticaret platformu backend API'si.

## Özellikler

- **İki kanallı satış sistemi**: B2C (son kullanıcılar) ve B2B (bayiler)
- **5 farklı fiyat seviyesi**: Perakende, küçük bayi, orta bayi, büyük bayi, ana bayi
- **Ürün görünürlük kontrolü**: Kullanıcı tipine göre ürün filtreleme
- **JWT Authentication**: Güvenli kimlik doğrulama
- **Rol tabanlı yetkilendirme**: Customer, Dealer, Admin, Supplier
- **Sipariş yönetimi**: Tam özellikli sipariş sistemi
- **Franchise başvuru sistemi**: Online başvuru formu
- **RESTful API**: Tam dokümante edilmiş API endpoints

## Teknoloji Stack

- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **MongoDB** + **Mongoose** - Veritabanı
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Environment Değişkenlerini Ayarla

`.env.example` dosyasını kopyalayıp `.env` olarak kaydedin ve değerleri doldurun:

```bash
cp .env.example .env
```

Gerekli değişkenler:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ottoman-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. MongoDB Kurulumu

**Seçenek A: Local MongoDB**

```bash
# MongoDB'nin sisteminizde kurulu olduğundan emin olun
# https://www.mongodb.com/try/download/community

# MongoDB servisini başlatın
mongod
```

**Seçenek B: MongoDB Atlas (Cloud)**

1. https://www.mongodb.com/cloud/atlas adresine gidin
2. Ücretsiz cluster oluşturun
3. Connection string'i alın
4. `.env` dosyasına ekleyin:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ottoman-platform
```

### 4. Uygulamayı Başlat

**Development modu:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

### Authentication

```
POST   /api/auth/register/customer    # Müşteri kaydı
POST   /api/auth/register/dealer      # Bayi kaydı
POST   /api/auth/login                # Giriş
GET    /api/auth/profile              # Profil bilgileri (protected)
PUT    /api/auth/profile              # Profil güncelleme (protected)
```

### Products

```
GET    /api/products                  # Ürün listesi (fiyatlar kullanıcıya göre)
GET    /api/products/:id              # Ürün detayı
POST   /api/products                  # Ürün ekle (admin/supplier)
PUT    /api/products/:id              # Ürün güncelle (admin/supplier)
DELETE /api/products/:id              # Ürün sil (admin)
POST   /api/products/import/xml       # XML ile ürün yükleme (admin/supplier)
```

### Orders

```
POST   /api/orders                    # Sipariş oluştur (protected)
GET    /api/orders/my-orders          # Siparişlerim (protected)
GET    /api/orders/:id                # Sipariş detayı (protected)
GET    /api/orders                    # Tüm siparişler (admin)
PATCH  /api/orders/:id/status         # Sipariş durumu güncelle (admin)
```

### Franchise

```
POST   /api/franchise/apply           # Franchise başvurusu
GET    /api/franchise                 # Tüm başvurular (admin)
GET    /api/franchise/:id             # Başvuru detayı (admin)
PATCH  /api/franchise/:id/status      # Başvuru durumu güncelle (admin)
```

## Kullanıcı Tipleri ve Fiyatlandırma

### Kullanıcı Rolleri

1. **customer**: Son kullanıcı - perakende fiyatı görür
2. **dealer**: Bayi - dealer tier'ına göre fiyat görür
   - small: Küçük bayi fiyatı
   - medium: Orta bayi fiyatı
   - large: Büyük bayi fiyatı
   - main_dealer: Ana bayi fiyatı
3. **admin**: Yönetici - tüm özelliklere erişim
4. **supplier**: Tedarikçi - kendi ürünlerini yönetir

### Fiyat Mantığı

Her ürün 5 farklı fiyat içerir:

```json
{
  "pricing": {
    "retail": 100,
    "dealer_small": 85,
    "dealer_medium": 80,
    "dealer_large": 75,
    "dealer_main": 70
  }
}
```

API, kullanıcı tipine göre otomatik olarak doğru fiyatı döner.

### Görünürlük Kontrolü

Ürünler kullanıcı tipine göre filtrelenir:

```json
{
  "visibility": {
    "customer": true,
    "dealer": true,
    "dealer_main": true
  }
}
```

## Örnek Request'ler

### Müşteri Kaydı

```bash
curl -X POST http://localhost:5000/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "phone": "+905551234567"
  }'
```

### Bayi Kaydı

```bash
curl -X POST http://localhost:5000/api/auth/register/dealer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dealer@example.com",
    "password": "123456",
    "companyName": "ABC Ltd.",
    "taxNumber": "1234567890",
    "dealerTier": "medium",
    "phone": "+905551234567"
  }'
```

### Giriş

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456"
  }'
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "userType": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Ürün Ekleme (Admin)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Premium Yazıcı",
    "sku": "YAZICI-001",
    "description": "Yüksek kaliteli lazer yazıcı",
    "category": "electronics",
    "pricing": {
      "retail": 5000,
      "dealer_small": 4500,
      "dealer_medium": 4200,
      "dealer_large": 4000,
      "dealer_main": 3800
    },
    "visibility": {
      "customer": true,
      "dealer": true
    },
    "stock": 50
  }'
```

## Proje Yapısı

```
backend/
├── src/
│   ├── config/           # Konfigürasyon dosyaları
│   │   └── database.ts
│   ├── controllers/      # Route controller'ları
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   └── franchiseController.ts
│   ├── middleware/       # Express middleware'ler
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── models/          # Mongoose modelleri
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── FranchiseApplication.ts
│   │   ├── Category.ts
│   │   └── DealerFormField.ts
│   ├── routes/          # API route tanımları
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── franchiseRoutes.ts
│   ├── types/           # TypeScript tip tanımları
│   │   └── index.ts
│   ├── utils/           # Yardımcı fonksiyonlar
│   │   ├── jwt.ts
│   │   └── pricing.ts
│   └── server.ts        # Ana server dosyası
├── .env.example         # Örnek environment dosyası
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Güvenlik

- Tüm şifreler bcrypt ile hash'lenir
- JWT token'lar için güçlü secret key kullanın
- Rate limiting aktif (15 dakikada 100 istek)
- Helmet middleware ile security headers
- CORS koruması
- Input validation (express-validator)

## Gelecek Özellikler

- [ ] Redis cache entegrasyonu
- [ ] XML ürün import implementasyonu
- [ ] Pazar yeri entegrasyonları (Trendyol, Hepsiburada, N11)
- [ ] Email bildirimleri
- [ ] Dosya yükleme (ürün görselleri)
- [ ] Ödeme gateway entegrasyonu
- [ ] WebSocket (gerçek zamanlı sipariş takibi)
- [ ] API rate limiting per user
- [ ] Detaylı logging
- [ ] Unit ve integration testleri

## Lisans

MIT

## Destek

Sorularınız için: [email protected]
