# 🚀 Ottoman Platform - Quick Start Guide

5 dakikada backend API'yi çalışır hale getirin!

---

## ⚡ Hızlı Kurulum

### 1️⃣ Bağımlılıkları Yükle

```bash
cd backend
npm install
```

### 2️⃣ Environment Ayarla

```bash
# .env dosyası oluştur
cp .env.example .env
```

**Minimal .env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ottoman-platform
JWT_SECRET=super-gizli-anahtar-12345
FRONTEND_URL=http://localhost:3000
```

### 3️⃣ MongoDB'yi Başlat

**Seçenek A: Local MongoDB**
```bash
# MongoDB servisini başlat
mongod
```

**Seçenek B: MongoDB Atlas (Cloud - Önerilen)**
1. https://www.mongodb.com/cloud/atlas
2. Free cluster oluştur
3. Connection string'i kopyala
4. `.env` dosyasına yapıştır:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ottoman
   ```

### 4️⃣ Sunucuyu Başlat

```bash
npm run dev
```

✅ Sunucu çalışıyor: http://localhost:5000

---

## 📝 İlk Test

### Health Check

```bash
curl http://localhost:5000/health
```

**Beklenen yanıt:**
```json
{
  "success": true,
  "message": "Ottoman Platform API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🌱 Test Verisi Yükle

```bash
npm run seed
```

Bu komut aşağıdaki verileri oluşturur:

### 👥 Kullanıcılar

| Rol | Email | Şifre |
|-----|-------|-------|
| **Admin** | admin@ottoman.com | admin123 |
| **Müşteri** | customer@test.com | 123456 |
| **Bayi** | dealer@test.com | 123456 |

### 🛍️ Ürünler

- 5 adet örnek ürün (yazıcı, laptop, koltuk, kağıt, toner)
- 3 kategori (Elektronik, Ofis Malzemeleri, Mobilya)
- Farklı fiyat seviyeleri
- Görünürlük ayarları

---

## 🧪 API Testleri

### 1. Kullanıcı Kaydı

```bash
curl -X POST http://localhost:5000/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456",
    "firstName": "Test",
    "lastName": "User",
    "phone": "5551234567"
  }'
```

### 2. Giriş

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "123456"
  }'
```

**Token'ı kaydet:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUz..."  // 👈 Bunu kopyala
  }
}
```

### 3. Ürünleri Listele

```bash
# Public (retail fiyatlar)
curl http://localhost:5000/api/products

# Authenticated (kullanıcıya özel fiyatlar)
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Sipariş Oluştur

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID_HERE",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "fullName": "Test User",
      "phone": "5551234567",
      "street": "Test Sokak No:1",
      "city": "İstanbul",
      "state": "İstanbul",
      "country": "Türkiye",
      "postalCode": "34000"
    }
  }'
```

---

## 🛠️ Yararlı Komutlar

```bash
# Development
npm run dev              # Geliştirme modunda başlat
npm run build            # TypeScript'i compile et
npm start               # Production modda başlat

# Testing
npm test                # Testleri çalıştır
npm run test:watch      # Test watch modu
npm run test:coverage   # Test coverage

# Code Quality
npm run lint            # Lint kontrolü
npm run lint:fix        # Lint hatalarını düzelt
npm run format          # Kodu formatla
npm run type-check      # TypeScript tip kontrolü

# Database
npm run seed            # Test verisi yükle

# Utility
npm run clean           # Build klasörünü temizle
```

---

## 📱 API Collection Import

### Thunder Client (VS Code)

1. VS Code'da Thunder Client extension'ı yükle
2. `api-collection.json` dosyasını import et
3. Tüm endpoint'ler hazır!

### Postman

1. Postman'i aç
2. Import → File → `api-collection.json` seç
3. Collection import edildi!

---

## 🎯 Fiyat Sistemini Test Et

### Müşteri olarak giriş (retail fiyat)

```bash
# Login as customer
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"123456"}' \
  | jq -r '.data.token')

# Get products (retail price: 5000 TL)
curl -s http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Bayi olarak giriş (dealer fiyat)

```bash
# Login as dealer (medium tier)
DEALER_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dealer@test.com","password":"123456"}' \
  | jq -r '.data.token')

# Get products (dealer_medium price: 4200 TL)
curl -s http://localhost:5000/api/products \
  -H "Authorization: Bearer $DEALER_TOKEN" | jq
```

**Sonuç:** Aynı ürün, farklı kullanıcılara farklı fiyatlarla gösterilir! 🎉

---

## 🔍 Ürün Görünürlük Testi

### Son kullanıcı olarak

```bash
# A4 kağıdı ve toner gösterilmez (visibility.customer = false)
curl -s http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.products[] | .name'
```

### Bayi olarak

```bash
# Tüm ürünler gösterilir (visibility.dealer = true)
curl -s http://localhost:5000/api/products \
  -H "Authorization: Bearer $DEALER_TOKEN" \
  | jq '.data.products[] | .name'
```

---

## 🐛 Sorun Giderme

### MongoDB bağlantı hatası

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Çözüm:**
- Local: `mongod` komutuyla MongoDB'yi başlatın
- Cloud: MongoDB Atlas connection string'ini kontrol edin

### Port zaten kullanımda

```
Error: listen EADDRINUSE :::5000
```

**Çözüm:**
```bash
# .env dosyasında farklı port seç
PORT=5001
```

### JWT token invalid

```
401 Unauthorized: Invalid or expired token
```

**Çözüm:**
- Yeni token almak için tekrar login yapın
- JWT_SECRET'ın doğru olduğundan emin olun

---

## 📚 Sonraki Adımlar

1. ✅ Backend çalışıyor
2. ⏭️ Admin paneli ile ürün ekle
3. ⏭️ Frontend geliştirmeye başla
4. ⏭️ Pazar yeri entegrasyonları
5. ⏭️ Ödeme gateway ekle

---

## 💡 İpuçları

- MongoDB Atlas kullanın (ücretsiz 512MB)
- Seed data'yı kullanarak hızlı test edin
- Thunder Client ile API'yi test edin
- Token'ları environment variable'da saklayın
- Geliştirme sırasında `npm run dev` kullanın

---

## 🆘 Yardım

Sorun mu yaşıyorsunuz?

1. Backend README'yi okuyun
2. API collection'ı test edin
3. MongoDB bağlantısını kontrol edin
4. `.env` dosyasını gözden geçirin

**İletişim:** [email protected]

---

🎉 **Tebrikler!** Backend API'niz hazır. Artık geliştirmeye başlayabilirsiniz!
