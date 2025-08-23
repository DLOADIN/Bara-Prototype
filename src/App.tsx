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
