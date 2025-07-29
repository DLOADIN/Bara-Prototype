import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";

export const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("Atlanta, GA");

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
            Discover Local<sup className="text-sm">℠</sup>
          </h1>
          
          {/* Search Form */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Business Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Find a business"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 font-sf-text border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue"
                />
              </div>
              
              {/* Location Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 font-sf-text border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue"
                />
              </div>
              
              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="bg-yp-yellow hover:bg-yp-yellow-hover text-yp-dark font-sf-text font-semibold h-12 px-8 text-base"
              >
                FIND
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};