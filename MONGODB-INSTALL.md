# MongoDB WSL Kurulum Rehberi

Bu rehber, WSL içinde MongoDB'yi kullanıcı adı ve şifre ile nasıl kuracağınızı gösterir.

---

## 📦 Adım 1: MongoDB Repository Ekle

```bash
# MongoDB GPG key ekle
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Repository ekle (Ubuntu 22.04 için)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Package listesini güncelle
sudo apt update
```

---

## 📥 Adım 2: MongoDB Kur

```bash
# MongoDB'yi kur
sudo apt install -y mongodb-org

# Data klasörünü oluştur
sudo mkdir -p /data/db

# İzinleri ayarla
sudo chown -R mongodb:mongodb /data/db
```

---

## 🔐 Adım 3: Kimlik Doğrulama Olmadan Başlat (İlk Kez)

```bash
# MongoDB'yi başlat
sudo systemctl start mongod

# Çalıştığını kontrol et
sudo systemctl status mongod
```

---

## 👤 Adım 4: Admin Kullanıcısı Oluştur

MongoDB shell'e bağlan:

```bash
mongosh
```

MongoDB shell içinde şu komutları çalıştır:

```javascript
// Admin veritabanına geç
use admin

// Root kullanıcı oluştur
db.createUser({
  user: "root",
  pwd: "_Aa102030!",
  roles: [
    { role: "root", db: "admin" }
  ]
})

// Çıkış yap
exit
```

---

## 🔒 Adım 5: Kimlik Doğrulamayı Aktif Et

MongoDB config dosyasını düzenle:

```bash
sudo nano /etc/mongod.conf
```

Şu satırları ekle/değiştir:

```yaml
# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1

# security
security:
  authorization: enabled
```

Kaydet ve çık (Ctrl+X, Y, Enter)

---

## 🔄 Adım 6: MongoDB'yi Yeniden Başlat

```bash
# MongoDB'yi durdur
sudo systemctl stop mongod

# Yeniden başlat
sudo systemctl start mongod

# Çalıştığını kontrol et
sudo systemctl status mongod

# Otomatik başlatmayı aktif et
sudo systemctl enable mongod
```

---

## ✅ Adım 7: Bağlantıyı Test Et

```bash
# Kimlik doğrulama ile bağlan
mongosh -u root -p '_Aa102030!' --authenticationDatabase admin

# Başarılıysa MongoDB shell açılacak
```

MongoDB shell'de:

```javascript
// Veritabanlarını listele
show dbs

// Ottoman platform veritabanını oluştur
use ottoman-platform

// Test koleksiyonu oluştur
db.test.insertOne({ message: "Hello Ottoman!" })

// Başarılıysa çıkış
exit
```

---

## 🔧 Adım 8: Backend .env Dosyasını Güncelle

```bash
cd /home/wsl-msbnr/projeler/veyaz/ottoman-platform/backend
nano .env
```

MONGODB_URI'yi değiştir:

```env
MONGODB_URI=mongodb://root:_Aa102030!@localhost:27017/ottoman-platform?authSource=admin
```

Kaydet ve çık.

---

## 🚀 Adım 9: Backend'i Başlat

```bash
cd /home/wsl-msbnr/projeler/veyaz/ottoman-platform/backend

# Sunucuyu başlat
npm run dev
```

Başarılı bağlantı mesajını göreceksiniz:
```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
```

---

## 🌱 Adım 10: Test Verisi Yükle

```bash
# Seed script'i çalıştır
npm run seed
```

Göreceğiniz çıktı:
```
✅ MongoDB connected
🗑️  Clearing existing data...
✅ Existing data cleared
📦 Seeding categories...
✅ 3 categories created
👥 Seeding users...
✅ 3 users created
🛍️  Seeding products...
✅ 5 products created

🎉 Database seeded successfully!

📝 Test Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin:
  Email: admin@ottoman.com
  Password: admin123

Customer:
  Email: customer@test.com
  Password: 123456

Dealer (Medium Tier):
  Email: dealer@test.com
  Password: 123456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧪 Adım 11: API Testleri

### Health Check
```bash
curl http://localhost:5000/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "123456"
  }'
```

Token'ı kopyalayın ve kullanın:

### Ürünleri Listele
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ Yararlı Komutlar

```bash
# MongoDB durumunu kontrol et
sudo systemctl status mongod

# MongoDB'yi başlat
sudo systemctl start mongod

# MongoDB'yi durdur
sudo systemctl stop mongod

# MongoDB'yi yeniden başlat
sudo systemctl restart mongod

# MongoDB loglarını gör
sudo tail -f /var/log/mongodb/mongod.log

# Mongosh'a bağlan
mongosh -u root -p '_Aa102030!' --authenticationDatabase admin
```

---

## 🐛 Sorun Giderme

### MongoDB başlamıyor

```bash
# Log dosyasını kontrol et
sudo tail -50 /var/log/mongodb/mongod.log

# Data klasörü izinlerini kontrol et
ls -la /data/db

# İzinleri düzelt
sudo chown -R mongodb:mongodb /data/db
```

### Bağlantı hatası

```bash
# MongoDB'nin çalıştığını kontrol et
sudo systemctl status mongod

# Port'un açık olduğunu kontrol et
sudo netstat -tlnp | grep 27017

# Firewall kontrolü (gerekirse)
sudo ufw allow 27017
```

### Kimlik doğrulama hatası

```bash
# Kullanıcıyı kontrol et
mongosh --eval "db.getSiblingDB('admin').getUsers()" -u root -p '_Aa102030!' --authenticationDatabase admin
```

---

## 🎉 Tebrikler!

MongoDB başarıyla kuruldu ve backend API çalışıyor!

**Sonraki Adımlar:**
1. ✅ API'yi test edin
2. ⏭️ Frontend geliştirmeye başlayın
3. ⏭️ Ek özellikler ekleyin

---

## 📚 Ek Kaynaklar

- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- API Collection: `backend/api-collection.json`
- Quick Start: `backend/QUICKSTART.md`

**Destek:** Bu rehberde sorun yaşarsanız, adım adım kontrol edin ve log dosyalarını inceleyin.
