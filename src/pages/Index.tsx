import { Header } from "@/components/Header";
import { BannerAd } from "@/components/BannerAd";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BusinessSection } from "@/components/BusinessSection";
import { QASection } from "@/components/QASection";
import PopupAd from "@/components/PopupAd";

import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      <PopupAd
        imageUrl="/1.jpg"
        linkUrl="https://your-sponsor.com"
        intervalSeconds={600}
        firstDelaySeconds={6}
        frequencyKey="popup_home"
      />
      <BannerAd />
      <HeroSection />
      <CategoryGrid />
      <BannerAd />
      <BusinessSection />
      <QASection />
      <Footer />
    </div>
  );
};

export default Index;
