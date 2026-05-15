import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MenuSection } from "@/components/menu-section"
import { AboutSection } from "@/components/about-section"
import { FeaturesSection } from "@/components/features-section"
import { ReviewsSection } from "@/components/reviews-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <MenuSection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

