import Page from '../models/Page';

export const seedPages = async () => {
  try {
    const defaultPages = [
      {
        title: 'Gizlilik Politikası',
        slug: 'privacy',
        content: `# Gizlilik Politikası

Ottoman Platform olarak, kişisel verilerinizin gizliliğine önem veriyoruz.

## Toplanan Bilgiler

- Ad ve Soyad
- E-posta Adresi
- Telefon Numarası
- Teslimat Adresi

## Bilgilerin Kullanımı

Topladığımız bilgiler aşağıdaki amaçlarla kullanılmaktadır:

- Siparişlerinizi işlemek ve göndermek
- Müşteri hizmetleri desteği sağlamak
- Platform deneyiminizi geliştirmek
- Size özel teklifler ve kampanyalar hakkında bilgi vermek

## Bilgilerin Güvenliği

Kişisel bilgileriniz SSL sertifikası ile şifrelenmiş bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır.

## İletişim

Gizlilik politikamız hakkında sorularınız için: info@ottoman.com`,
        isPublished: true,
        showInMenu: true,
        menuOrder: 1,
      },
      {
        title: 'Kullanım Şartları',
        slug: 'terms',
        content: `# Kullanım Şartları

Ottoman Platform'u kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.

## Genel Şartlar

- Platform üzerinden yapılan tüm işlemler kayıt altına alınır
- Kullanıcılar doğru ve güncel bilgi vermekle yükümlüdür
- Hesap güvenliği kullanıcının sorumluluğundadır

## Sipariş ve Teslimat

- Siparişler onaylandıktan sonra iade edilemez (yasal haklar saklıdır)
- Teslimat süreleri bölgeye göre değişiklik gösterebilir
- Ürün fiyatları önceden haber verilmeksizin değiştirilebilir

## Yasaklı Kullanımlar

- Platform'u yasadışı amaçlarla kullanmak
- Başkasının hesabını kullanmak
- Sahte bilgi vermek
- Sistemi manipüle etmeye çalışmak

## İletişim

Kullanım şartları hakkında sorularınız için: info@ottoman.com`,
        isPublished: true,
        showInMenu: true,
        menuOrder: 2,
      },
      {
        title: 'Çerez Politikası',
        slug: 'cookies',
        content: `# Çerez Politikası

Ottoman Platform olarak, web sitemizde çerezler kullanıyoruz.

## Çerez Nedir?

Çerezler, ziyaret ettiğiniz web sitelerinin tarayıcınıza gönderdiği küçük metin dosyalarıdır.

## Kullandığımız Çerezler

### Zorunlu Çerezler
- Oturum çerezleri (giriş durumunuzu korur)
- Güvenlik çerezleri
- Sepet bilgileri

### Analitik Çerezler
- Sayfa görüntüleme istatistikleri
- Kullanıcı davranış analizi
- Platform performans ölçümü

### Pazarlama Çerezleri
- Kişiselleştirilmiş reklamlar
- Kampanya takibi

## Çerezleri Yönetme

Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Ancak bu durumda bazı özellikler çalışmayabilir.

## İletişim

Çerez politikamız hakkında sorularınız için: info@ottoman.com`,
        isPublished: true,
        showInMenu: true,
        menuOrder: 3,
      },
      {
        title: 'Sıkça Sorulan Sorular',
        slug: 'faq',
        content: `# Sıkça Sorulan Sorular

## Sipariş ve Ödeme

**S: Hangi ödeme yöntemlerini kabul ediyorsunuz?**
C: Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur.

**S: Siparişimi nasıl takip edebilirim?**
C: Hesabınıza giriş yaparak "Siparişlerim" bölümünden siparişinizi takip edebilirsiniz.

**S: Sipariş iptali yapabilir miyim?**
C: Kargoya verilmeden önce siparişinizi iptal edebilirsiniz.

## Teslimat

**S: Teslimat süresi ne kadar?**
C: Standart teslimat 2-5 iş günü arasındadır. Bölgeye göre değişiklik gösterebilir.

**S: Kargo ücreti ne kadar?**
C: 500 TL üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde 50 TL kargo ücreti uygulanır.

**S: Yurt dışına gönderim yapıyor musunuz?**
C: Şu anda sadece Türkiye içi teslimat yapıyoruz.

## İade ve Değişim

**S: İade şartlarınız nedir?**
C: Ürünü teslim aldıktan sonra 14 gün içinde kullanılmamış ve ambalajı açılmamış olması şartıyla iade edebilirsiniz.

**S: İade süreci nasıl işler?**
C: "Siparişlerim" bölümünden iade talebi oluşturabilirsiniz. Ürün tarafımıza ulaştıktan sonra 10 iş günü içinde iade işleminiz tamamlanır.

## Bayi ve Franchise

**S: Bayi olabilmek için şartlar nelerdir?**
C: Franchise sayfamızdan başvuru yapabilirsiniz. Ekibimiz sizinle iletişime geçecektir.

**S: Bayi fiyatlandırması nasıl çalışır?**
C: Aylık ciro hedefinize göre %10 ile %24 arasında değişen indirim oranları sunuyoruz.`,
        isPublished: true,
        showInMenu: true,
        menuOrder: 4,
      },
      {
        title: 'Kargo ve Teslimat',
        slug: 'shipping',
        content: `# Kargo ve Teslimat Bilgileri

## Teslimat Süreleri

- **Standart Teslimat**: 2-5 iş günü
- **Hızlı Teslimat**: 1-2 iş günü (ek ücret)
- **Aynı Gün Teslimat**: İstanbul için geçerli (saat 12:00'ye kadar verilen siparişler)

## Kargo Ücretleri

| Sipariş Tutarı | Kargo Ücreti |
|----------------|--------------|
| 0 - 500 TL     | 50 TL        |
| 500+ TL        | Ücretsiz     |

## Kargo Firmaları

- Aras Kargo
- MNG Kargo
- Yurtiçi Kargo
- PTT Kargo

## Teslimat Bölgeleri

Türkiye'nin tüm illerine teslimat yapıyoruz.

### Uzak Bölgeler
Bazı uzak bölgelerde teslimat süresi 1-2 gün uzayabilir:
- Hakkari
- Şırnak
- Ardahan
- Kars

## Kargo Takibi

Siparişiniz kargoya verildikten sonra SMS ve e-posta ile kargo takip numaranız tarafınıza iletilir.

## Teslimat Sorunları

Kargo ile ilgili sorun yaşarsanız:
- E-posta: kargo@ottoman.com
- Telefon: +90 (212) 555 0001`,
        isPublished: true,
        showInMenu: true,
        menuOrder: 5,
      },
      {
        title: 'İade ve Değişim Koşulları',
        slug: 'returns',
        content: `# İade ve Değişim Koşulları

## İade Hakkı

6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, ürünü teslim aldığınız tarihten itibaren **14 gün** içinde cayma hakkınızı kullanabilirsiniz.

## İade Edilebilecek Ürünler

### Kabul Edilen İadeler
- Ambalajı açılmamış ürünler
- Kullanılmamış ürünler
- Hasarsız ve eksiksiz ürünler
- Fatura ve iade formu ile birlikte gönderilen ürünler

### İade Edilemeyen Ürünler
- Hijyen şartları nedeniyle geri gönderilmesi uygun olmayan ürünler
- Özel olarak üretilmiş veya kişiye özel hale getirilmiş ürünler
- Ambalajı açılmış yazılım ve dijital ürünler

## İade Süreci

1. **İade Talebi Oluşturma**
   - Hesabınıza giriş yapın
   - "Siparişlerim" bölümüne gidin
   - İade etmek istediğiniz siparişi seçin
   - "İade Talebi Oluştur" butonuna tıklayın

2. **Ürünü Gönderme**
   - İade kodu tarafınıza e-posta ile gönderilir
   - Ürünü orijinal ambalajında, fatura ile birlikte gönderin
   - İade kargo ücreti tarafımızdan karşılanır

3. **İnceleme**
   - Ürün tarafımıza ulaştıktan sonra 2 iş günü içinde kontrol edilir
   - Ürün iade şartlarına uygunsa işlem onaylanır

4. **Para İadesi**
   - Onaylanan iadeler için 10 iş günü içinde ödeme iade edilir
   - İade, ödeme yaptığınız yönteme yapılır

## Değişim

Ürün değişimi için önce iade işlemi yapmanız, ardından yeni sipariş vermeniz gerekmektedir.

## Hasarlı/Eksik Ürün

Ürünü teslim alırken kargo görevlisinin yanında kontrol edin. Hasarlı veya eksik teslimat durumunda:
- Kargo tutanağına "hasarlı" veya "eksik" yazın
- Ürünü teslim almayın veya şerhli teslim alın
- 2 gün içinde info@ottoman.com adresine bildirim yapın

## İletişim

İade işlemleri için:
- E-posta: iade@ottoman.com
- Telefon: +90 (212) 555 0002`,
        isPublished: true,
        showInMenu: false,
        menuOrder: 6,
      },
    ];

    // Check each page individually and only insert if it doesn't exist
    let createdCount = 0;
    for (const pageData of defaultPages) {
      const exists = await Page.findOne({ slug: pageData.slug });
      if (!exists) {
        await Page.create(pageData);
        createdCount++;
        console.log(`✅ Created page: ${pageData.title}`);
      } else {
        console.log(`📄 Page already exists: ${pageData.title}`);
      }
    }

    if (createdCount > 0) {
      console.log(`✅ ${createdCount} default page(s) created successfully`);
    } else {
      console.log('📄 All default pages already exist');
    }
  } catch (error) {
    console.error('❌ Error seeding pages:', error);
  }
};
