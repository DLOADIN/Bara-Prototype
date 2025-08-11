import { useState } from "react";
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

const cities = [
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

export const Header = () => {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState("");

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
            <span className="ml-2 font-sf-pro font-medium text-yp-dark text-lg">
            </span>
            </Link> 
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="font-sf-text">
              <Building className="w-4 h-4 mr-1" />
              {t('navigation.advertise')}
            </Button>
            
            <Link to="/writeareview">
              <Button variant="ghost" className="font-sf-text">
                <Star className="w-4 h-4 mr-1" />
                {t('navigation.writeReview')}
              </Button>
            </Link>

            {/* Search by City Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-sf-text">
                  {t('navigation.searchByCity')}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg">
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`font-sf-text ${
                      selectedCity === city ? "bg-yp-gray-light" : ""
                    }`}
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
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