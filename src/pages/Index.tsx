import { Header } from "@/components/Header";
import { TopBannerAd } from "@/components/TopBannerAd";
import { BottomBannerAd } from "@/components/BottomBannerAd";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BusinessSection } from "@/components/BusinessSection";
import { QASection } from "@/components/QASection";
import FrontendPopup from "@/components/FrontendPopup";

import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      <FrontendPopup 
        intervalSeconds={15}
        firstDelaySeconds={3}
        closeLabel="Close"
      />
      <TopBannerAd />
      <HeroSection />
      <CategoryGrid />
      <BusinessSection />
      <QASection />
      <BottomBannerAd />
      <Footer />
    </div>
  );
};

export default Index;
