import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#050505] to-[#000000] border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Ottoman Platform"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-ottoman-cream/70 text-sm mb-4">
              Tarihi değerleri modern iş dünyasıyla buluşturan, kaliteli ofis ürünleri ve franchise çözümleri sunan platformunuz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ottoman-cream/70 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-ottoman-cream/70 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-ottoman-cream/70 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-ottoman-cream/70 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/franchise" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Franchise
                </Link>
              </li>
              <li>
                <Link href="/business-model" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  İş Modeli
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Kargo Bilgileri
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  İade Koşulları
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                <span className="text-ottoman-cream/70 text-sm">
                  İstanbul, Türkiye
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <a href="tel:+905551234567" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  +90 (555) 123 45 67
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <a href="mailto:info@ottoman.com" className="text-ottoman-cream/70 hover:text-white transition-colors text-sm">
                  info@ottoman.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-ottoman"></div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-ottoman-cream/50 text-sm">
            © 2024 Ottoman Platform. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-ottoman-cream/50 hover:text-white transition-colors text-sm">
              Gizlilik
            </Link>
            <Link href="/terms" className="text-ottoman-cream/50 hover:text-white transition-colors text-sm">
              Şartlar
            </Link>
            <Link href="/cookies" className="text-ottoman-cream/50 hover:text-white transition-colors text-sm">
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
