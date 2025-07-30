import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Star, Building } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="bg-yp-dark text-white px-3 py-2 rounded-md font-sf-pro font-bold text-lg">
                ML
              </div>
            </Link>
            <Link to="/"> 
            <span className="ml-2 font-sf-pro font-medium text-yp-dark text-lg">
              The Real More Listings
            </span>
            </Link> 
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="font-sf-text">
              <Building className="w-4 h-4 mr-1" />
              Advertise
            </Button>
            
            <Link to="/writeareview">
              <Button variant="ghost" className="font-sf-text">
                <Star className="w-4 h-4 mr-1" />
                Write a Review
              </Button>
            </Link>

            {/* Search by City Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-sf-text">
                  Search by City
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