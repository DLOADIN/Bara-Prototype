import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Star, Building } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "./LanguageSelector";
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
  };
}

export const Header = () => {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState("");
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
          .order('name', { ascending: true })
          .limit(10); // Limit to 10 cities for the header dropdown

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

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-30">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center py-4">
                <Link to="/">
                <img src="/bara-3.png" className="w-30 h-16" alt="Logo picture" />
                </Link>
                <Link to="/">
                <img src="/bara-1-removebg-preview.png" className="w-30 h-16" alt="Logo picture" />
                </Link>
              </div>
            </Link>
            <Link to="/"> 
            {/* <span className="ml-2 font-comfortaa font-medium text-yp-dark text-lg">
              
            </span> */}
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

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};