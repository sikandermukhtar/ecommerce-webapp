import HeroSection from "@/components/HeroSection";
import BestSellers from "@/components/BestSeller";
import NewArrivals from "@/components/NewArrivals";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Viewport Height */}
      <HeroSection />

      {/* Best Sellers Section */}
      <BestSellers />

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  )
}
