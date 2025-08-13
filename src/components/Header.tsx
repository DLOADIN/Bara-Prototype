import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Star, Building, X, Globe, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "./LanguageSelector";
import { AdminNavLink } from "./AdminNavLink";
import { db } from "@/lib/supabase";

interface City {
  id: string;
  name: string;
  country_id: string;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  countries: {
    name: string;
    code: string;
  } | null;
}

export const Header = () => {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await db.cities()
          .select(`
            id,
            name,
            country_id,
            latitude,
            longitude,
            population,
            countries (
              name,
              code
            )
          `)
          .order('name', { ascending: true })
          .limit(10);

        if (error) {
          console.error('Error fetching cities:', error);
        } else {
          setCities(data || []);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const formatCityDisplay = (city: City) => {
    return `${city.name}, ${city.countries?.code || ''}`;
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(formatCityDisplay(city));
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-30">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center py-4">
                <img src="/bara-3.png" className="w-30 h-16" alt="Logo picture" />
                <img src="/bara-1-removebg-preview.png" className="w-30 h-16" alt="Logo picture" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="font-roboto">
              <Building className="w-4 h-4 mr-1" />
              {t('navigation.advertise')}
            </Button>
            
            <Link to="/writeareview">
              <Button variant="ghost" className="font-roboto">
                <Star className="w-4 h-4 mr-1" />
                {t('navigation.writeReview')}
              </Button>
            </Link>

            {/* Admin Link */}
            <AdminNavLink />

            {/* Search by City Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-roboto">
                  {t('navigation.searchByCity')}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                    <p className="text-xs text-yp-gray-dark mt-1">{t('common.loading')}</p>
                  </div>
                ) : (
                  cities.map((city) => (
                    <DropdownMenuItem
                      key={city.id}
                      onClick={() => setSelectedCity(formatCityDisplay(city))}
                      className={`font-roboto ${
                        selectedCity === formatCityDisplay(city) ? "bg-yp-gray-light" : ""
                      }`}
                    >
                      {formatCityDisplay(city)}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-comfortaa font-semibold text-yp-dark">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Advertise */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    Business Services
                  </h3>
                  <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                    <Building className="w-5 h-5 mr-3" />
                    {t('navigation.advertise')}
                  </Button>
                </div>

                {/* Write Review */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    User Actions
                  </h3>
                  <Link to="/writeareview" onClick={toggleMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                      <Star className="w-5 h-5 mr-3" />
                      {t('navigation.writeReview')}
                    </Button>
                  </Link>
                </div>

                {/* Admin Access */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    Administration
                  </h3>
                  <Link to="/admin" onClick={toggleMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                      <Shield className="w-5 h-5 mr-3" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>

                {/* Cities Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    {t('navigation.searchByCity')}
                  </h3>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                      <p className="text-xs text-gray-500 mt-1">{t('common.loading')}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cities.map((city) => (
                        <Button
                          key={city.id}
                          variant="ghost"
                          className={`w-full justify-start font-roboto h-12 ${
                            selectedCity === formatCityDisplay(city) ? "bg-yp-blue text-white" : ""
                          }`}
                          onClick={() => handleCitySelect(city)}
                        >
                          <MapPin className="w-5 h-5 mr-3" />
                          {formatCityDisplay(city)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language Selector */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    Language
                  </h3>
                  <div className="pl-4">
                    <LanguageSelector />
                  </div>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 font-roboto text-center">
                  Bara App - Connect with Local Businesses
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};