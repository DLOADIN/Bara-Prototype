import { Header } from "@/components/Header";
import { BannerAd } from "@/components/BannerAd";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BusinessSection } from "@/components/BusinessSection";
import { QASection } from "@/components/QASection";

import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      <BannerAd />
      <HeroSection />
      <CategoryGrid />
      <BusinessSection />
      <QASection />
      <Footer />
    </div>
  );
};

export default Index;
