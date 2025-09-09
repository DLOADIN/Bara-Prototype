import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Marketplace Page – Coming Soon
            </h1>
            <p className="text-lg text-gray-600">
              We're working hard to bring you an amazing marketplace experience.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
