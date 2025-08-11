import { useState } from "react";
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

// All locations from the app
const allLocations = [
  "Kigali, RW",
  "Cairo, EGY", 
  "Nairobi, KEN",
  "Cape Town, SA",
  "Harare, ZMB",
  "Mbarara, UG",
  "Dodoma, TZ",
  "Addis Ababa, ETH",
  "Durban, SA",
  "Abuja, NG"
];

export const HeroSection = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("Kigali, RW");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleSearch = () => {
    // Search functionality would be implemented here
    console.log("Searching for:", searchTerm, "in", location);
  };

  return (
    <section className="relative">
      {/* Hero Image Background */}
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <h1 className="text-4xl md:text-5xl font-sf-pro font-bold text-yp-dark text-center mb-8">
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
                  className="pl-10 h-12 font-sf-text border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue"
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
                        className="pl-10 pr-10 h-12 font-sf-text border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue cursor-pointer"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-5 h-5" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto bg-white border border-yp-gray-medium shadow-lg">
                    <div className="p-2">
                      <h3 className="text-sm font-sf-text font-semibold text-yp-dark mb-2 px-2">QUICK LOCATIONS</h3>
                      {allLocations.map((loc) => (
                        <DropdownMenuItem
                          key={loc}
                          onClick={() => {
                            setLocation(loc);
                            setIsLocationOpen(false);
                          }}
                          className={`font-sf-text px-2 py-2 cursor-pointer hover:bg-yp-gray-light ${
                            location === loc ? "bg-yp-gray-light text-yp-blue" : "text-yp-dark"
                          }`}
                        >
                          {loc}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="bg-yp-blue hover:bg-yp-blue-dark text-white font-sf-text font-semibold px-8 h-12"
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