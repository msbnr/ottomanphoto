import HeroSection from '@/components/HeroSection'
import BannerCarousel from '@/components/BannerCarousel'
import FeaturedProducts from '@/components/FeaturedProducts'
import BusinessModel from '@/components/BusinessModel'
import FranchiseSection from '@/components/FranchiseSection'

export default function HomePage() {
  return (
    <>
      <section className="w-full px-4 py-8">
        <div className="container mx-auto">
          <BannerCarousel />
        </div>
      </section>
      <HeroSection />
      <FeaturedProducts />
      <BusinessModel />
      <FranchiseSection />
    </>
  )
}
