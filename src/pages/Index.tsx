import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BusinessSection } from "@/components/BusinessSection";
import { QASection } from "@/components/QASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sf-pro">
      <Header />
      <HeroSection />
      <CategoryGrid />
      <BusinessSection />
      <QASection />
    </div>
  );
};

export default Index;
