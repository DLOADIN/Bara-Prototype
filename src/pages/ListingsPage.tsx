import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Clock, Filter, RotateCcw } from "lucide-react";

// Mock data for listings
const mockListings = [
  {
    id: 1,
    name: "Elite Dental Care",
    category: "Dentists",
    phone: "(+250) 788 123 456",
    address: "KN 4 Ave, Kigali, Rwanda",
    website: "www.elitedentalrw.com",
    rating: 4.8,
    reviews: 64,
    distance: "0.5 mi",
    isOpen: true,
    hours: "Open until 6:00 PM",
    tags: ["Cosmetic Dentistry", "Emergency Services", "Insurance Accepted"]
  },
  {
    id: 2,
    name: "SmileCare Clinic",
    category: "Dentists",
    phone: "(+250) 788 234 567",
    address: "Kimihurura, Kigali, Rwanda",
    website: "www.smilecarerw.com",
    rating: 4.5,
    reviews: 89,
    distance: "1.2 mi",
    isOpen: false,
    hours: "Closed • Opens 8:00 AM",
    tags: ["Orthodontics", "Children's Dentistry", "Whitening"]
  },
  {
    id: 3,
    name: "Modern Dental Solutions",
    category: "Dentists",
    phone: "(+250) 788 345 678",
    address: "Nyarutarama, Kigali, Rwanda",
    website: "www.moderndentalrw.com",
    rating: 4.9,
    reviews: 156,
    distance: "2.1 mi",
    isOpen: true,
    hours: "Open until 7:00 PM",
    tags: ["Implants", "Root Canal", "Preventive Care"]
  }
];

export const ListingsPage = () => {
  const { city, category } = useParams();
  
  const formatTitle = (str: string) => {
    return str?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  const cityName = formatTitle(city || '');
  const categoryName = formatTitle(category || '');

  return (
    <div className="min-h-screen bg-background font-sf-pro">
      <Header />
      
      {/* Search Header */}
      <div className="bg-yp-yellow py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder={categoryName}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-sf-text"
                defaultValue={categoryName}
              />
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md font-sf-text"
                  defaultValue={`${cityName}, Rwanda`}
                />
              </div>
            </div>
            <Button className="bg-yp-blue hover:bg-yp-blue/90 text-white px-8 font-sf-text">
              Find
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="font-sf-text">
              <MapPin className="w-4 h-4 mr-1" />
              Map View
            </Button>
            <Button variant="outline" size="sm" className="font-sf-text">
              <Filter className="w-4 h-4 mr-1" />
              All
            </Button>
            <Button variant="outline" size="sm" className="font-sf-text">
              Order Online
            </Button>
            <Button variant="outline" size="sm" className="font-sf-text">
              Kid Friendly
            </Button>
            <Button variant="outline" size="sm" className="font-sf-text">
              Coupons
            </Button>
            <div className="ml-auto">
              <span className="text-sm text-gray-600 font-sf-text">Sort: Default</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Clock className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 font-sf-text">
            View all businesses that are OPEN 24 Hours
          </span>
          <RotateCcw className="w-4 h-4 text-gray-400 ml-2" />
        </div>

        <div className="space-y-6">
          {mockListings.map((listing) => (
            <div key={listing.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-yp-dark font-sf-pro mr-2">
                      {listing.name}
                    </h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(listing.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600 font-sf-text">
                        ({listing.reviews})
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 font-sf-text mb-2">
                    {listing.category}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-sf-text">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 font-sf-text">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {listing.address}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${listing.phone}`} className="text-yp-blue hover:underline">
                        {listing.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <a href={`https://${listing.website}`} className="text-yp-blue hover:underline">
                        {listing.website}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className={listing.isOpen ? 'text-green-600' : 'text-red-600'}>
                        {listing.hours}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-sf-text mb-2">
                    {listing.distance}
                  </div>
                  <Button size="sm" variant="outline" className="font-sf-text">
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="font-sf-text">
            Load More Results
          </Button>
        </div>
      </div>
    </div>
  );
};