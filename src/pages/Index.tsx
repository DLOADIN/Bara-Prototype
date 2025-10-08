import { Header } from "@/components/Header";
import { TopBannerAd } from "@/components/TopBannerAd";
import { BottomBannerAd } from "@/components/BottomBannerAd";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BusinessSection } from "@/components/BusinessSection";
import { QASection } from "@/components/QASection";
import PopupAd from "@/components/PopupAd";
import { useEffect, useRef, useState } from "react";
import { fetchActivePopupAds } from "@/lib/popupAdsService";

import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      <DbPopupAd firstDelaySeconds={20} intervalSeconds={600} frequencyKey="popup_home_db" />
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

type DbPopupProps = { intervalSeconds?: number; firstDelaySeconds?: number; frequencyKey?: string };
function DbPopupAd({ intervalSeconds = 600, firstDelaySeconds = 20, frequencyKey = "popup_home_db" }: DbPopupProps) {
  const [imgs, setImgs] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const ads = await fetchActivePopupAds(50);
      setImgs(ads.map((a) => a.image_url).filter(Boolean));
    })();
  }, []);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const schedule = (delay: number) => {
      timerRef.current = window.setTimeout(() => {
        setIdx((i) => (imgs.length ? (i + 1) % imgs.length : i));
        schedule(intervalSeconds);
      }, delay * 1000);
    };
    schedule(firstDelaySeconds);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [imgs.length, intervalSeconds, firstDelaySeconds]);

  if (imgs.length === 0) return null;
  return (
    <PopupAd imageUrl={imgs[idx]} intervalSeconds={intervalSeconds} firstDelaySeconds={firstDelaySeconds} frequencyKey={frequencyKey} />
  );
}
