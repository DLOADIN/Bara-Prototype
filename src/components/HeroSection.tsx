import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import heroImage from "@/assets/hero-kitchen.jpg";
import { db } from "@/lib/supabase";

// Remove the hardcoded allLocations array and replace with Supabase data
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
  };
}

export const HeroSection = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

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
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching cities:', error);
        } else {
          // Type assertion to handle the Supabase response structure
          const typedData = (data as unknown) as Array<{
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
          }>;
          setCities(typedData || []);
          // Set default location to first city if available
          if (typedData && typedData.length > 0) {
            const firstCity = typedData[0];
            setLocation(`${firstCity.name}, ${firstCity.countries?.code || ''}`);
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleSearch = () => {
    // Search functionality would be implemented here
    console.log("Searching for:", searchTerm, "in", location);
  };

  const formatCityDisplay = (city: City) => {
    return `${city.name}, ${city.countries?.code || ''}`;
  };

  return (
    <section className="relative">
      {/* Hero Image Background */}
      <div className="relative h-[70vh] bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <h1 className="text-4xl md:text-5xl font-comfortaa font-bold text-yp-dark text-center mb-8">
            {t('homepage.hero.title')}<sup className="text-sm">℠</sup>
          </h1>
          
          {/* Search Form */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Business Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('homepage.hero.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 font-roboto border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue"
                />
              </div>
              
              {/* Location Dropdown */}
              <div className="flex-1 relative">
                <DropdownMenu open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                  <DropdownMenuTrigger asChild>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-5 h-5" />
                      <Input
                        type="text"
                        placeholder={t('homepage.hero.locationPlaceholder')}
                        value={location}
                        readOnly
                        className="pl-10 pr-10 h-12 font-roboto border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue cursor-pointer"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-5 h-5" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto bg-white border border-yp-gray-medium shadow-lg">
                    <div className="p-2">
                      <h3 className="text-sm font-roboto font-semibold text-yp-dark mb-2 px-2">QUICK LOCATIONS</h3>
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                          <p className="text-xs text-yp-gray-dark mt-1">{t('common.loading')}</p>
                        </div>
                      ) : (
                        cities.map((city) => (
                          <DropdownMenuItem
                            key={city.id}
                            onClick={() => {
                              setLocation(formatCityDisplay(city));
                              setIsLocationOpen(false);
                            }}
                            className={`font-roboto px-2 py-2 cursor-pointer hover:bg-yp-gray-light ${
                              location === formatCityDisplay(city) ? "bg-yp-gray-light text-yp-blue" : "text-yp-dark"
                            }`}
                          >
                            {formatCityDisplay(city)}
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="bg-yp-blue hover:bg-[#4e3c28] text-white font-roboto font-semibold px-8 h-12"
              >
                {t('homepage.hero.searchButton')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};