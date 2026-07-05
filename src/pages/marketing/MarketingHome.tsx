// Screen A — Marketing site (chronix.com)
import { Navbar } from '../../components/marketing/Navbar';
import { Hero } from '../../components/marketing/Hero';
import { FeaturesSection } from '../../components/marketing/FeaturesSection';
import { PricingSection } from '../../components/marketing/PricingSection';
import { FAQSection } from '../../components/marketing/FAQSection';
import { Footer } from '../../components/marketing/Footer';

export function MarketingHome() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
