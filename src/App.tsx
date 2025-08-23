import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ListingsPage } from "./pages/ListingsPage";
import { WriteReviewPage } from "./pages/WriteReviewPage";
import { BusinessDetailPage } from "./pages/BusinessDetailPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CityDetailPage } from "./pages/CityDetailPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCities } from "./pages/admin/AdminCities";
import { AdminCountries } from "./pages/admin/AdminCountries";
import { AdminBusinesses } from "./pages/admin/AdminBusinesses";
import { AdminReviews } from "./pages/admin/AdminReviews";
import { AdminAuthGuard } from "./components/admin/AdminAuthGuard";
import { GoogleMapsTest } from "./components/GoogleMapsTest";
import { MapTestPage } from "./pages/MapTestPage";
import { SimpleMapTest } from "./pages/SimpleMapTest";
import { SimpleMapTest as SimpleMapTestComponent } from "./components/SimpleMapTest";
import { CityMapLeafletCallback } from "./components/CityMapLeafletCallback";
import { UltraSimpleMap } from "./components/UltraSimpleMap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/writeareview" element={<WriteReviewPage />} />
          <Route path="/write-review/:businessId" element={<WriteReviewPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categorySlug" element={<ListingsPage />} />
          <Route path="/:city/search" element={<ListingsPage />} />
          <Route path="/:city/:category" element={<ListingsPage />} />
          <Route path="/:city/:category/:businessId" element={<BusinessDetailPage />} />
          <Route path="/cities/:citySlug" element={<CityDetailPage />} />
          <Route path="/googlemaps" element={<GoogleMapsTest />} />
          <Route path="/map-test" element={<MapTestPage />} />
          <Route path="/simple-map-test" element={<SimpleMapTest />} />
        <Route path="/simple-map-test-component" element={<SimpleMapTestComponent />} />
        <Route path="/callback-map-test" element={
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Callback Map Test</h1>
            <CityMapLeafletCallback
              cityName="Cairo"
              latitude={30.0444}
              longitude={31.2357}
              businesses={[
                {
                  id: 'test-1',
                  name: 'Test Restaurant',
                  description: 'A test restaurant',
                  phone: '+1234567890',
                  website: 'https://example.com',
                  address: '123 Test St',
                  latitude: 30.0444 + 0.001,
                  longitude: 31.2357 + 0.001,
                  category: { name: 'Restaurant', slug: 'restaurant' },
                  reviews: []
                }
              ]}
              height="500px"
            />
          </div>
        } />
        <Route path="/ultra-simple-map" element={
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Ultra Simple Map Test</h1>
            <UltraSimpleMap />
          </div>
        } />
          
          {/* Admin Routes - Protected by AdminAuthGuard */}
          <Route path="/admin" element={
            <AdminAuthGuard>
              <AdminDashboard />
            </AdminAuthGuard>
          } />
          <Route path="/admin/cities" element={
            <AdminAuthGuard>
              <AdminCities />
            </AdminAuthGuard>
          } />
          <Route path="/admin/countries" element={
            <AdminAuthGuard>
              <AdminCountries />
            </AdminAuthGuard>
          } />
          <Route path="/admin/businesses" element={
            <AdminAuthGuard>
              <AdminBusinesses />
            </AdminAuthGuard>
          } />
          <Route path="/admin/reviews" element={
            <AdminAuthGuard>
              <AdminReviews />
            </AdminAuthGuard>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
