# ☁️ CLOUDFLARE DNS AYARLARI - OTTOMAN PLATFORM

Bu rehber, Railway'de çalışan Ottoman Platform projenizi Cloudflare DNS ile kendi domain'inize nasıl bağlayacağınızı detaylı şekilde anlatır.

---

## 🎯 GENEL BAKIŞ

**Ne Yapacağız?**
Railway'in otomatik verdiği uzun URL'ler yerine kendi domain'inizi kullanacaksınız:

**Önce (Railway URL'leri)**:
```
Backend:  https://ottoman-backend-production-abc123.up.railway.app
Frontend: https://ottoman-frontend-production-xyz789.up.railway.app
```

**Sonra (Kendi Domain'iniz)**:
```
Backend:  https://api.ottomanplatform.com
Frontend: https://ottomanplatform.com ve https://www.ottomanplatform.com
```

---

## 📋 GEREKSINIMLER

1. **Domain**: Kendi domain adınız (örn: ottomanplatform.com)
2. **Cloudflare Hesabı**: Ücretsiz hesap yeterli
3. **Railway Servisleri**: Backend ve Frontend Railway'de çalışıyor olmalı
4. **Railway URL'leri**: Her iki servisin de Railway URL'lerini bilmeniz gerekli

---

## 🚀 ADIM 1: DOMAIN'I CLOUDFLARE'E EKLEME

### 1.1. Cloudflare Dashboard'a Giriş

1. https://dash.cloudflare.com/ adresine gidin
2. Login yapın (veya ücretsiz hesap açın)

### 1.2. Domain Ekle

1. **Add a Site** tıklayın
2. Domain adınızı girin: `ottomanplatform.com`
3. **Add Site** tıklayın
4. **Free Plan** seçin
5. **Continue** tıklayın

### 1.3. DNS Kayıtlarını Tarama

Cloudflare, mevcut DNS kayıtlarınızı otomatik tarar:
- Bu adımı **Continue** ile geçin (yeni kayıtlar manuel ekleyeceğiz)

### 1.4. Nameserver'ları Değiştirme

Cloudflare size 2 nameserver verecek:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

**Domain satın aldığınız yerde** (GoDaddy, Namecheap, vs.) nameserver'ları değiştirin:

#### GoDaddy için:
1. GoDaddy → Domains → Domain'iniz → Manage
2. **Nameservers** bölümünde **Change** tıklayın
3. **Custom** seçin
4. Cloudflare nameserver'larını girin
5. **Save** tıklayın

#### Namecheap için:
1. Namecheap → Domain List → Manage
2. **Nameservers** → **Custom DNS**
3. Cloudflare nameserver'larını girin
4. ✓ işareti tıklayın

**DNS Propagation**: 2-24 saat sürebilir (genelde 2-4 saat)

Cloudflare'de **Done, check nameservers** tıklayın.

---

## 🔗 ADIM 2: RAILWAY URL'LERİNİ ALMA

DNS kayıtları eklemeden önce, Railway servislerinizin URL'lerini almanız gerekiyor.

### 2.1. Backend URL

1. Railway Dashboard → **Backend servisiniz**
2. **Settings** sekmesi → **Domains** bölümü
3. Railway'in otomatik verdiği URL'yi kopyalayın:
   ```
   ottoman-backend-production-abc123.up.railway.app
   ```
   (HTTPS kısmını kopyalamayın, sadece domain)

### 2.2. Frontend URL

1. Railway Dashboard → **Frontend servisiniz**
2. **Settings** sekmesi → **Domains** bölümü
3. Railway'in otomatik verdiği URL'yi kopyalayın:
   ```
   ottoman-frontend-production-xyz789.up.railway.app
   ```

**ÖNEMLİ**: Bu URL'leri bir yere not edin!

---

## 🌐 ADIM 3: CLOUDFLARE DNS KAYITLARI EKLEME

### 3.1. DNS Management Sayfası

1. Cloudflare Dashboard → Domain'iniz
2. **DNS** → **Records** sekmesi

### 3.2. Backend için DNS Kaydı (api subdomain)

**CNAME kaydı ekle**:

1. **Add record** tıklayın
2. Aşağıdaki bilgileri girin:

| Alan         | Değer                                              |
|--------------|----------------------------------------------------|
| Type         | CNAME                                              |
| Name         | api                                                |
| Target       | ottoman-backend-production-abc123.up.railway.app   |
| Proxy status | DNS only (gri bulut)                               |
| TTL          | Auto                                               |

3. **Save** tıklayın

**Görsel Açıklama**:
- **Type**: Dropdown'dan CNAME seçin
- **Name**: `api` yazın (api.ottomanplatform.com olacak)
- **Target**: Railway backend URL'inizi yapıştırın (https:// olmadan)
- **Proxy status**: Bulut simgesine tıklayarak **gri bulut** yapın (DNS only)

**ÖNEMLI**: Proxy status **mutlaka DNS only** (gri bulut) olmalı! Railway ile Cloudflare proxy çalışmaz.

### 3.3. Frontend için DNS Kaydı (Root domain - @)

**CNAME kaydı ekle**:

1. **Add record** tıklayın
2. Bilgileri girin:

| Alan         | Değer                                               |
|--------------|-----------------------------------------------------|
| Type         | CNAME                                               |
| Name         | @                                                   |
| Target       | ottoman-frontend-production-xyz789.up.railway.app   |
| Proxy status | DNS only (gri bulut)                                |
| TTL          | Auto                                                |

3. **Save** tıklayın

**Not**: `@` sembolü root domain'i temsil eder (ottomanplatform.com)

### 3.4. Frontend için DNS Kaydı (www subdomain)

**CNAME kaydı ekle**:

1. **Add record** tıklayın
2. Bilgileri girin:

| Alan         | Değer                                               |
|--------------|-----------------------------------------------------|
| Type         | CNAME                                               |
| Name         | www                                                 |
| Target       | ottoman-frontend-production-xyz789.up.railway.app   |
| Proxy status | DNS only (gri bulut)                                |
| TTL          | Auto                                                |

3. **Save** tıklayın

---

## ✅ ADIM 4: DNS KAYITLARINI DOĞRULAMA

Cloudflare DNS Records sayfanızda şu 3 kayıt görünmeli:

| Type  | Name | Content                                             | Proxy status |
|-------|------|-----------------------------------------------------|--------------|
| CNAME | api  | ottoman-backend-production-abc123.up.railway.app    | DNS only     |
| CNAME | @    | ottoman-frontend-production-xyz789.up.railway.app   | DNS only     |
| CNAME | www  | ottoman-frontend-production-xyz789.up.railway.app   | DNS only     |

**Hepsi gri bulut (DNS only) olmalı!**

---

## 🚂 ADIM 5: RAILWAY'DE CUSTOM DOMAIN EKLEME

DNS kayıtlarını ekledikten sonra Railway'e custom domain'lerinizi eklemelisiniz.

### 5.1. Backend için Custom Domain

1. Railway Dashboard → **Backend servisine** gidin
2. **Settings** sekmesi → **Domains** bölümü
3. **Custom Domain** tıklayın
4. Domain girin: `api.ottomanplatform.com`
5. **Add** tıklayın

Railway, DNS kaydını doğrulayacak:
- ✅ Yeşil tik: Domain başarıyla bağlandı
- ⏳ Sarı ünlem: DNS propagation bekleniyor (5-10 dakika)
- ❌ Kırmızı X: DNS kaydı yanlış veya bulunamadı

### 5.2. Frontend için Custom Domain (Root - @)

1. Railway Dashboard → **Frontend servisine** gidin
2. **Settings** sekmesi → **Domains** bölümü
3. **Custom Domain** tıklayın
4. Domain girin: `ottomanplatform.com`
5. **Add** tıklayın

### 5.3. Frontend için Custom Domain (www)

1. Aynı frontend servisinde
2. **Custom Domain** tekrar tıklayın
3. Domain girin: `www.ottomanplatform.com`
4. **Add** tıklayın

**Sonuç**: Frontend servisinde 2 custom domain olmalı:
- ✅ `ottomanplatform.com`
- ✅ `www.ottomanplatform.com`

---

## 🔄 ADIM 6: ENVIRONMENT VARIABLES GÜNCELLEME

Custom domain'ler eklendikten sonra environment variables'ı güncellemelisiniz.

### 6.1. Backend Environment Variables

1. Railway → **Backend servisine** gidin
2. **Variables** sekmesi
3. Şu değişkenleri güncelleyin:

```bash
# Railway URL yerine custom domain kullan
FRONTEND_URL=https://ottomanplatform.com
```

4. **Save Changes** (Veya otomatik kaydedilir)
5. Backend servisi **otomatik restart** olacak

### 6.2. Frontend Environment Variables

1. Railway → **Frontend servisine** gidin
2. **Variables** sekmesi
3. Şu değişkenleri güncelleyin:

```bash
# Railway URL yerine custom domain kullan
NEXT_PUBLIC_API_URL=https://api.ottomanplatform.com/api
NEXT_PUBLIC_BASE_URL=https://api.ottomanplatform.com
```

4. Frontend servisi **otomatik restart** olacak

**ÖNEMLİ**: Environment variable değişince her iki servis de yeniden deploy olur (~2-3 dakika).

---

## 🔒 ADIM 7: SSL SERTİFİKASI DOĞRULAMA

Railway otomatik olarak Let's Encrypt SSL sertifikası sağlar.

### 7.1. SSL Durumu Kontrolü

Railway Dashboard'da her domain için SSL durumunu görebilirsiniz:

**Backend (api.ottomanplatform.com)**:
1. Backend servisi → **Settings** → **Domains**
2. `api.ottomanplatform.com` yanında **yeşil kilit** 🔒 olmalı
3. Status: **Active**

**Frontend (ottomanplatform.com ve www)**:
1. Frontend servisi → **Settings** → **Domains**
2. Her iki domain yanında **yeşil kilit** 🔒 olmalı
3. Status: **Active**

### 7.2. HTTPS Test

Tarayıcıda açın ve adres çubuğunda kilit simgesini kontrol edin:

```
https://api.ottomanplatform.com/health        → 🔒 Güvenli
https://ottomanplatform.com                    → 🔒 Güvenli
https://www.ottomanplatform.com                → 🔒 Güvenli
```

**SSL Sertifikası Bilgileri**:
- İssuer: Let's Encrypt
- Validity: 90 gün (Railway otomatik yeniler)
- Encryption: TLS 1.3

---

## 🧪 ADIM 8: TEST VE DOĞRULAMA

### 8.1. DNS Propagation Kontrolü

Terminal'de test edin:

```bash
# Backend DNS
nslookup api.ottomanplatform.com

# Frontend DNS
nslookup ottomanplatform.com
nslookup www.ottomanplatform.com
```

Beklenen çıktı:
```
Name:    api.ottomanplatform.com
Address: XXX.XXX.XXX.XXX  (Railway IP adresi)
```

**Online Araçlar**:
- https://dnschecker.org/ → Domain'inizi test edin (global propagation)
- https://www.whatsmydns.net/ → Farklı DNS sunucularında kontrol

### 8.2. Backend API Testi

```bash
curl https://api.ottomanplatform.com/health
```

Beklenen:
```json
{"success":true,"message":"Ottoman Platform API is running","timestamp":"..."}
```

Eğer hata alırsanız:
- ❌ **CORS error**: Backend `FRONTEND_URL` kontrol edin
- ❌ **404 Not Found**: DNS henüz propagate olmamış, 10 dakika bekleyin
- ❌ **SSL error**: Railway SSL henüz aktif değil, 5 dakika bekleyin

### 8.3. Frontend Testi

Tarayıcıda test edin:

```
https://ottomanplatform.com          → Ana sayfa açılmalı
https://www.ottomanplatform.com      → Ana sayfa açılmalı
https://ottomanplatform.com/products → Ürünler sayfası
https://ottomanplatform.com/admin    → Admin login
```

**Test Checklist**:
- ✅ Ana sayfa yükleniyor
- ✅ Banner carousel çalışıyor
- ✅ Ürünler API'den geliyor
- ✅ Login sayfası açılıyor
- ✅ Resimler yükleniyor
- ✅ Console'da CORS hatası yok

### 8.4. Railway Logs Kontrolü

**Backend Logs**:
```
Railway → Backend servisi → Logs sekmesi
```

Şunları görmelisiniz:
```
MongoDB connected successfully
Server running on port 5000
```

**Frontend Logs**:
```
Railway → Frontend servisi → Logs sekmesi
```

Şunları görmelisiniz:
```
ready - started server on 0.0.0.0:3000
```

---

## ⚙️ ADIM 9: CLOUDFLARE AYARLARINI OPTİMİZE ETME

### 9.1. SSL/TLS Ayarları

1. Cloudflare → **SSL/TLS** sekmesi
2. **Overview** → Encryption mode
3. **Full (strict)** seçin

**Mod Açıklamaları**:
- ❌ **Off**: SSL yok (kullanmayın)
- ❌ **Flexible**: Cloudflare-Browser arası SSL, Cloudflare-Railway arası yok
- ✅ **Full**: Her iki tarafta da SSL
- ✅ **Full (strict)**: Full + sertifika doğrulama (en güvenli)

### 9.2. Always Use HTTPS

1. Cloudflare → **SSL/TLS** → **Edge Certificates**
2. **Always Use HTTPS**: **On** yapın

Bu, HTTP trafiği otomatik HTTPS'e yönlendirir:
```
http://ottomanplatform.com → https://ottomanplatform.com
```

### 9.3. Minimum TLS Version

1. Cloudflare → **SSL/TLS** → **Edge Certificates**
2. **Minimum TLS Version**: **TLS 1.2** seçin (önerilir)

### 9.4. HTTP Strict Transport Security (HSTS)

1. Cloudflare → **SSL/TLS** → **Edge Certificates**
2. **HTTP Strict Transport Security (HSTS)** → **Enable HSTS**
3. Ayarlar:
   - **Max Age Header**: 6 months
   - **Apply HSTS policy to subdomains**: ✅ Aktif
   - **No-Sniff Header**: ✅ Aktif
   - **Preload**: ✅ Aktif (opsiyonel)

**Uyarı**: HSTS'i aktif ettikten sonra geri alamazsınız! SSL'in çalıştığından emin olduktan sonra aktif edin.

---

## 🚀 ADIM 10: PERFORMANS OPTİMİZASYONU (OPSİYONEL)

**NOT**: Railway ile Cloudflare Proxy (turuncu bulut) **ÇALIŞMAZ**. Bu yüzden aşağıdaki özellikler **kullanılamaz**:

❌ **Kullanılamayan Cloudflare Özellikleri** (Proxy gerektirir):
- Caching (CDN)
- Page Rules
- Argo Smart Routing
- DDoS Protection (Layer 7)

✅ **Kullanılabilir Cloudflare Özellikleri** (Proxy gerektirmez):
- DNS Management
- SSL/TLS
- DNSSEC
- Analytics (Basic)

**Performans için alternatifler**:
1. Railway'de **multiple regions** kullanın (ücretli)
2. Next.js built-in optimizasyonları zaten aktif (Image Optimization, Code Splitting)
3. Backend'de caching (Redis) ekleyin

---

## 🔧 SORUN GİDERME

### Sorun 1: DNS Propagate Olmuyor

**Belirti**: Domain açılmıyor, "DNS_PROBE_FINISHED_NXDOMAIN" hatası

**Çözümler**:
1. **Nameserver kontrolü**: Domain sağlayıcınızda nameserver'lar doğru mu?
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
2. **DNS cache temizle**:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac/Linux
   sudo dscacheutil -flushcache
   ```
3. **Bekleyin**: DNS propagation 2-24 saat sürebilir
4. **Online test**: https://dnschecker.org/ ile global kontrol

### Sorun 2: Railway Domain Doğrulanmıyor

**Belirti**: Railway'de custom domain yanında ❌ kırmızı X

**Çözümler**:
1. Cloudflare'de **DNS only (gri bulut)** olduğunu doğrulayın
2. CNAME kaydının **Target** değeri Railway URL ile eşleşiyor mu?
3. Railway'de **Remove Domain** → Tekrar ekleyin
4. 10-15 dakika bekleyin (DNS propagation)

### Sorun 3: SSL Sertifikası Aktif Olmuyor

**Belirti**: "Your connection is not private" hatası

**Çözümler**:
1. Railway'de domain **Active** durumda mı kontrol edin
2. 5-10 dakika bekleyin (Let's Encrypt sertifika oluşturması zaman alır)
3. Tarayıcı cache'i temizleyin (Ctrl+Shift+Delete)
4. Railway Logs'da hata var mı kontrol edin

### Sorun 4: CORS Hatası

**Belirti**: Frontend'de API çağrıları başarısız, Console'da CORS error

**Çözümler**:
1. Backend → Variables → `FRONTEND_URL` kontrol edin:
   ```
   FRONTEND_URL=https://ottomanplatform.com
   ```
   (Sonunda `/` olmamalı!)

2. Backend servisini restart edin

3. `backend/src/server.ts` dosyasında CORS ayarlarını kontrol edin:
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

### Sorun 5: API Endpoint Bulunamıyor (404)

**Belirti**: Frontend'de API çağrıları 404 döndürüyor

**Çözümler**:
1. Frontend → Variables kontrol:
   ```
   NEXT_PUBLIC_API_URL=https://api.ottomanplatform.com/api
   ```
   (Sonunda `/api` olmalı!)

2. Backend health check test edin:
   ```bash
   curl https://api.ottomanplatform.com/health
   ```

3. Railway backend logs'da endpoint'ler doğru kaydolmuş mu kontrol edin

### Sorun 6: Resimler Yüklenmiyor

**Belirti**: Ürün resimleri veya banner'lar görünmüyor

**Çözümler**:
1. Backend'de `uploads/` klasörü var mı kontrol edin
2. Backend → Settings → **Volumes** kontrol (Railway persistent storage)
3. Frontend'de image URL'leri doğru mu:
   ```typescript
   `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/products/${image}`
   ```

4. Railway'de backend **static file serving** aktif mi:
   ```typescript
   app.use('/uploads', express.static('uploads'));
   ```

---

## 📊 CLOUDFLARE ANALYTİCS

### DNS Only Modunda Analytics

Cloudflare Proxy kullanmadığınız için **sınırlı analytics** var:

**Kullanılabilir**:
- DNS queries
- Top DNS queries
- DNS response time

**Kullanılamaz**:
- HTTP traffic analytics
- Page views
- Bandwidth usage

**Alternatif Analytics**:
1. **Railway Metrics**: Her servis için CPU, RAM, Network
2. **Google Analytics**: Frontend'e ekleyin
3. **MongoDB Atlas Monitoring**: Database performansı

---

## 🎉 BAŞARILI KURULUM KONTROLLERİ

Tüm adımlar tamamlandığında:

### ✅ Cloudflare Kontrolü

- [ ] Domain Cloudflare'e eklendi
- [ ] Nameserver'lar değiştirildi (aktif)
- [ ] 3 DNS kaydı eklendi (api, @, www)
- [ ] Tüm kayıtlar **DNS only** (gri bulut)
- [ ] SSL/TLS: Full (strict) modunda
- [ ] Always Use HTTPS: Aktif

### ✅ Railway Kontrolü

- [ ] Backend custom domain: `api.ottomanplatform.com` ✅
- [ ] Frontend custom domain 1: `ottomanplatform.com` ✅
- [ ] Frontend custom domain 2: `www.ottomanplatform.com` ✅
- [ ] Tüm domain'ler yanında **yeşil kilit** 🔒
- [ ] SSL sertifikaları: Active
- [ ] Backend environment: `FRONTEND_URL` güncellendi
- [ ] Frontend environment: `NEXT_PUBLIC_API_URL` güncellendi

### ✅ Test Kontrolü

- [ ] Backend health check: `curl https://api.ottomanplatform.com/health` ✅
- [ ] Frontend açılıyor: `https://ottomanplatform.com` ✅
- [ ] WWW yönlendirmesi: `https://www.ottomanplatform.com` ✅
- [ ] HTTPS aktif: Adres çubuğunda **🔒 kilit** var
- [ ] Console'da CORS hatası yok
- [ ] Ürünler API'den yükleniyor
- [ ] Login/Register çalışıyor
- [ ] Admin paneline giriş yapılabiliyor

---

## 📝 DOMAIN YAPISI ÖZET

```
┌─────────────────────────────────────────────────────────┐
│                   CLOUDFLARE DNS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  api.ottomanplatform.com  ──────┐                      │
│  (CNAME → Railway Backend)       │                      │
│                                  │                      │
│  ottomanplatform.com  ───────────┼──────┐              │
│  (CNAME → Railway Frontend)      │      │              │
│                                  │      │              │
│  www.ottomanplatform.com  ───────┼──────┤              │
│  (CNAME → Railway Frontend)      │      │              │
└──────────────────────────────────┼──────┼──────────────┘
                                   │      │
                        ┌──────────▼      ▼──────────┐
                        │                             │
                        │      RAILWAY.APP            │
                        │                             │
                        │  ┌─────────────────────┐   │
                        │  │  Backend Service    │   │
                        │  │  (Express + MongoDB)│   │
                        │  │  Port: 5000         │   │
                        │  └─────────────────────┘   │
                        │                             │
                        │  ┌─────────────────────┐   │
                        │  │  Frontend Service   │   │
                        │  │  (Next.js)          │   │
                        │  │  Port: 3000         │   │
                        │  └─────────────────────┘   │
                        │                             │
                        │  ┌─────────────────────┐   │
                        │  │  MongoDB Database   │   │
                        │  │  Port: 27017        │   │
                        │  └─────────────────────┘   │
                        └─────────────────────────────┘
```

---

## 🌐 KULLANICI DENEYİMİ

Artık kullanıcılarınız şu adresleri kullanabilir:

1. **Ana Site**:
   ```
   https://ottomanplatform.com
   ```

2. **WWW Versiyonu** (otomatik yönlendirilir):
   ```
   https://www.ottomanplatform.com
   ```

3. **API Endpoint** (developer'lar için):
   ```
   https://api.ottomanplatform.com/api/products
   https://api.ottomanplatform.com/api/orders
   ```

---

## 🎊 TEBRIKLER!

Ottoman Platform artık kendi domain'inizde canlı!

**Sonraki Adımlar**:
1. Google Search Console'a domain ekleyin (SEO)
2. Google Analytics entegrasyonu
3. Site haritası (sitemap.xml) oluşturun
4. Social media meta tags kontrol edin
5. Performance testi yapın (PageSpeed Insights)

---

**Son Güncelleme**: 31 Ekim 2024
**Cloudflare Platform**: Free Plan
**Railway Platform**: Hobby Plan
**Ottoman Platform**: v1.0
