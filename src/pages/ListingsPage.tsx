import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Clock, Filter, RotateCcw } from "lucide-react";

// Category-specific mock data
const categoryListings = {
  dentists: [
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
    },
    {
      id: 4,
      name: "Family Dental Clinic",
      category: "Dentists",
      phone: "(+250) 788 456 789",
      address: "Remera, Kigali, Rwanda",
      website: "www.familydentalrw.com",
      rating: 4.6,
      reviews: 112,
      distance: "1.8 mi",
      isOpen: true,
      hours: "Open until 5:30 PM",
      tags: ["Family Dentistry", "Pediatric Care", "Cleanings"]
    },
    {
      id: 5,
      name: "Bright Smile Dental",
      category: "Dentists",
      phone: "(+250) 788 567 890",
      address: "Gaculiro, Kigali, Rwanda", 
      website: "www.brightsmilerw.com",
      rating: 4.7,
      reviews: 78,
      distance: "2.5 mi",
      isOpen: true,
      hours: "Open until 6:30 PM",
      tags: ["Teeth Whitening", "Veneers", "Oral Surgery"]
    }
  ],
  "auto-repair": [
    {
      id: 1,
      name: "Elite Auto Service",
      category: "Auto Repair",
      phone: "(+250) 788 111 222",
      address: "KN 3 Rd, Kigali, Rwanda",
      website: "www.eliteautorw.com",
      rating: 4.8,
      reviews: 145,
      distance: "0.3 mi",
      isOpen: true,
      hours: "Open until 7:00 PM",
      tags: ["Engine Repair", "Brake Service", "Oil Change"]
    },
    {
      id: 2,
      name: "Quick Fix Garage",
      category: "Auto Repair",
      phone: "(+250) 788 222 333",
      address: "Kimisagara, Kigali, Rwanda",
      website: "www.quickfixrw.com",
      rating: 4.5,
      reviews: 203,
      distance: "0.8 mi",
      isOpen: true,
      hours: "Open until 6:00 PM",
      tags: ["Transmission", "AC Repair", "Tire Service"]
    },
    {
      id: 3,
      name: "Master Mechanics",
      category: "Auto Repair",
      phone: "(+250) 788 333 444",
      address: "Nyabugogo, Kigali, Rwanda",
      website: "www.mastermechanicsrw.com",
      rating: 4.9,
      reviews: 187,
      distance: "1.1 mi",
      isOpen: false,
      hours: "Closed • Opens 7:30 AM",
      tags: ["Diagnostic", "Body Work", "Paint Service"]
    },
    {
      id: 4,
      name: "Pro Auto Center",
      category: "Auto Repair",
      phone: "(+250) 788 444 555",
      address: "Kacyiru, Kigali, Rwanda",
      website: "www.proautorw.com",
      rating: 4.6,
      reviews: 134,
      distance: "1.5 mi",
      isOpen: true,
      hours: "Open until 8:00 PM",
      tags: ["24/7 Service", "Towing", "Emergency Repair"]
    },
    {
      id: 5,
      name: "City Car Care",
      category: "Auto Repair", 
      phone: "(+250) 788 555 666",
      address: "Gikondo, Kigali, Rwanda",
      website: "www.citycarcare.com",
      rating: 4.4,
      reviews: 98,
      distance: "2.2 mi",
      isOpen: true,
      hours: "Open until 6:30 PM",
      tags: ["Alignment", "Suspension", "Exhaust"]
    }
  ],
  restaurants: [
    {
      id: 1,
      name: "The Hut Restaurant",
      category: "Restaurants",
      phone: "(+250) 788 777 888",
      address: "KN 2 Ave, Kigali, Rwanda",
      website: "www.hutrestaurant.com",
      rating: 4.7,
      reviews: 234,
      distance: "0.4 mi",
      isOpen: true,
      hours: "Open until 11:00 PM",
      tags: ["Continental", "Local Cuisine", "Fine Dining"]
    },
    {
      id: 2,
      name: "Mama's Kitchen",
      category: "Restaurants",
      phone: "(+250) 788 888 999",
      address: "Remera, Kigali, Rwanda",
      website: "www.mamaskitchen.com",
      rating: 4.6,
      reviews: 178,
      distance: "0.9 mi",
      isOpen: true,
      hours: "Open until 10:00 PM",
      tags: ["Traditional Food", "Family Style", "Takeout"]
    },
    {
      id: 3,
      name: "Urban Bistro",
      category: "Restaurants",
      phone: "(+250) 788 999 111",
      address: "Nyarutarama, Kigali, Rwanda",
      website: "www.urbanbistro.com",
      rating: 4.8,
      reviews: 156,
      distance: "1.3 mi",
      isOpen: false,
      hours: "Closed • Opens 6:00 AM",
      tags: ["Breakfast", "Brunch", "Coffee"]
    },
    {
      id: 4,
      name: "Spice Garden",
      category: "Restaurants",
      phone: "(+250) 788 111 333",
      address: "Kimihurura, Kigali, Rwanda",
      website: "www.spicegarden.com", 
      rating: 4.5,
      reviews: 201,
      distance: "1.7 mi",
      isOpen: true,
      hours: "Open until 9:30 PM",
      tags: ["Indian Cuisine", "Vegetarian", "Delivery"]
    }
  ],
  lawyers: [
    {
      id: 1,
      name: "Kigali Legal Associates",
      category: "Lawyers",
      phone: "(+250) 788 222 444",
      address: "KN 1 Ave, Kigali, Rwanda",
      website: "www.kigalilegal.com",
      rating: 4.9,
      reviews: 67,
      distance: "0.6 mi",
      isOpen: true,
      hours: "Open until 5:00 PM",
      tags: ["Corporate Law", "Real Estate", "Litigation"]
    },
    {
      id: 2,
      name: "Rwanda Law Chambers",
      category: "Lawyers",
      phone: "(+250) 788 333 555",
      address: "Kacyiru, Kigali, Rwanda",
      website: "www.rwandalaw.com",
      rating: 4.7,
      reviews: 89,
      distance: "1.1 mi",
      isOpen: true,
      hours: "Open until 6:00 PM",
      tags: ["Family Law", "Immigration", "Criminal Defense"]
    }
  ],
  plumbers: [
    {
      id: 1,
      name: "Expert Plumbing Services",
      category: "Plumbers",
      phone: "(+250) 788 444 666",
      address: "Gisozi, Kigali, Rwanda",
      website: "www.expertplumbing.com",
      rating: 4.6,
      reviews: 123,
      distance: "0.7 mi",
      isOpen: true,
      hours: "Open 24 Hours",
      tags: ["Emergency Service", "Pipe Repair", "Installation"]
    },
    {
      id: 2,
      name: "Flow Master Plumbing",
      category: "Plumbers",
      phone: "(+250) 788 555 777",
      address: "Kimisagara, Kigali, Rwanda",
      website: "www.flowmaster.com",
      rating: 4.8,
      reviews: 94,
      distance: "1.4 mi",
      isOpen: true,
      hours: "Open until 7:00 PM",
      tags: ["Drain Cleaning", "Water Heater", "Bathroom Remodel"]
    }
  ]
};

export const ListingsPage = () => {
  const { city, category } = useParams();
  
  const formatTitle = (str: string) => {
    return str?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  const cityName = formatTitle(city || '');
  const categoryName = formatTitle(category || '');
  
  // Get listings for current category
  const currentListings = categoryListings[category as keyof typeof categoryListings] || [];

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
          {currentListings.map((listing) => (
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
                  <div className="space-y-2">
                    <Link to={`/${city}/${category}/${listing.id}`}>
                      <Button size="sm" variant="outline" className="font-sf-text w-full">
                        More Info
                      </Button>
                    </Link>
                    <Link to="/write-review">
                      <Button size="sm" className="bg-yp-blue hover:bg-yp-blue/90 text-white font-sf-text w-full">
                        Write Review
                      </Button>
                    </Link>
                  </div>
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