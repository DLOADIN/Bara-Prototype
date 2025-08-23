import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Star, Building, X, Globe, MapPin, Shield, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "./LanguageSelector";
import { AdminNavLink } from "./AdminNavLink";
import { db } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface City {
  id: string;
  name: string;
  country_id: string;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  countries?: {
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
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [citiesExpanded, setCitiesExpanded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        console.log('Fetching cities from database...');
        
        // First try to get all cities
        let { data, error } = await db.cities()
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
          .order('name', { ascending: true });

        // If no data or error, try without the countries join
        if (error || !data || data.length === 0) {
          console.log('First query failed, trying fallback query...');
          const fallbackResult = await db.cities()
            .select('id, name, country_id, latitude, longitude, population')
            .order('name', { ascending: true });
          
          if (fallbackResult.error) {
            console.error('Fallback query also failed:', fallbackResult.error);
            throw fallbackResult.error;
          }
          
          // Transform fallback data to match City interface
          data = fallbackResult.data?.map(city => ({
            ...city,
            countries: null
          }));
          error = fallbackResult.error;
        }

        if (error) {
          console.error('Error fetching cities:', error);
          toast({
            title: 'Error',
            description: 'Failed to load cities. Please try again.',
            variant: "destructive"
          });
        } else {
          // Type assertion to handle the Supabase response structure
          const typedData = (data as unknown) as Array<{
            id: string;
            name: string;
            country_id: string;
            latitude: number | null;
            longitude: number | null;
            population: number | null;
            countries?: {
              name: string;
              code: string;
            } | null;
          }>;
          
          console.log(`Fetched ${typedData?.length || 0} cities from database:`, typedData);
          
          if (typedData && typedData.length > 0) {
            setCities(typedData);
          } else {
            console.warn('No cities found in database');
            setCities([]);
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load cities. Please try again.',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const formatCityDisplay = (city: City) => {
    return `${city.name}${city.countries?.code ? `, ${city.countries.code}` : ''}`;
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(formatCityDisplay(city));
    closeMobileMenu();
    // Navigate to city detail page
    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/cities/${citySlug}`);
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      setMobileMenuOpen(true);
      setMobileMenuClosing(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 300);
  };

  const toggleCitiesExpanded = () => {
    setCitiesExpanded(!citiesExpanded);
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
            {/* <Button variant="ghost" className="font-roboto">
              <Building className="w-4 h-4 mr-1" />
              {t('navigation.advertise')}
            </Button> */}
            
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
                <Button variant="default" className="font-roboto">
                  {t('navigation.searchByCity')}
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {cities.length}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 border border-border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                sideOffset={8}
              >
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                    <p className="text-xs mt-1">{t('common.loading')}</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {/* <div className="px-2 py-1.5 text-xs text-gray-500 border-b border-gray-100 mb-1">
                      {cities.length} cities available
                    </div> */}
                    {cities.map((city) => (
                      <DropdownMenuItem
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className="dropdown-menu-item-override font-roboto button cursor-pointer"
                      >
                        {formatCityDisplay(city)}
                      </DropdownMenuItem>
                    ))}
                  </div>
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
      {(mobileMenuOpen || mobileMenuClosing) && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
              mobileMenuClosing ? 'bg-opacity-0' : 'bg-opacity-50'
            }`}
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 transition-transform duration-300 ease-out ${
            mobileMenuClosing ? 'translate-x-full' : 'translate-x-0' }`}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-comfortaa font-semibold text-yp-dark">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="p-1 hover:bg-gray-100 transition-colors duration-200"
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
                  <Link to="/writeareview" onClick={closeMobileMenu}>
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
                  <Link to="/admin" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                      <Shield className="w-5 h-5 mr-3" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>

                {/* Cities Section */}
                <div className="space-y-3">
                  <button
                    onClick={toggleCitiesExpanded}
                    className="w-full flex items-center justify-between text-left text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide hover:text-yp-blue transition-colors duration-200"
                  >
                    <span>{t('navigation.searchByCity')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-normal">
                        {cities.length} cities
                      </span>
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          citiesExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    citiesExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                        <p className="text-xs text-gray-500 mt-1">{t('common.loading')}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pl-4 max-h-[600px] overflow-y-auto">
                        {cities.map((city) => (
                          <Button
                            key={city.id}
                            variant="ghost"
                            className={`w-full justify-start font-roboto h-10 text-sm transition-all duration-200 ${
                              selectedCity === formatCityDisplay(city) 
                                ? "bg-yp-blue text-white shadow-md" 
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => handleCitySelect(city)}
                          >
                            <MapPin className="w-4 h-4 mr-3" />
                            {formatCityDisplay(city)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
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