import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Clock, Building, ChevronRight, Camera, Users } from "lucide-react";

// Extended mock data with more details
const businessDetails = {
  1: {
    name: "Elite Dental Care",
    category: "Dentists",
    subcategories: ["Cosmetic Dentistry", "Emergency Services", "General Dentistry"],
    phone: "(+250) 788 123 456",
    address: "KN 4 Ave, Kigali, Rwanda",
    website: "www.elitedentalrw.com",
    rating: 4.8,
    reviews: 64,
    hours: {
      regular: "Mon - Sun",
      schedule: "Open 24 Hours"
    },
    yearsInBusiness: 15,
    description: "Elite Dental Care is a premier dental service provider in Kigali, Rwanda. We offer comprehensive dental care with state-of-the-art equipment and experienced professionals. Our services include preventive care, cosmetic dentistry, emergency treatments, and specialized procedures. We are committed to providing exceptional patient care in a comfortable environment.",
    extraPhones: ["(+250) 788 123 457", "(+250) 788 123 458"],
    accreditation: "Rwanda Dental Board, East African Dental Association",
    otherLinks: ["www.elitedentalrw.com/appointments", "www.elitedentalrw.com/services"],
    isOpen: true,
    openStatus: "OPEN 24 HOURS",
    openDetails: "Today: Open 24 Hours"
  },
  2: {
    name: "Elite Auto Service",
    category: "Auto Repair",
    subcategories: ["Engine Repair", "Brake Service", "Oil Change"],
    phone: "(+250) 788 111 222",
    address: "KN 3 Rd, Kigali, Rwanda",
    website: "www.eliteautorw.com",
    rating: 4.8,
    reviews: 145,
    hours: {
      regular: "Mon - Sun",
      schedule: "Open until 7:00 PM"
    },
    yearsInBusiness: 12,
    description: "Elite Auto Service is your trusted automotive repair center in Kigali. We specialize in comprehensive auto repair services including engine diagnostics, brake systems, transmission repair, and routine maintenance. Our certified technicians use modern equipment to ensure your vehicle runs smoothly and safely.",
    extraPhones: ["(+250) 788 111 223"],
    accreditation: "Rwanda Auto Mechanics Association, ISO 9001 Certified",
    otherLinks: ["www.eliteautorw.com/services", "www.eliteautorw.com/booking"],
    isOpen: true,
    openStatus: "OPEN until 7:00 PM",
    openDetails: "Today: Open until 7:00 PM"
  },
  3: {
    name: "The Hut Restaurant",
    category: "Restaurants",
    subcategories: ["Continental", "Local Cuisine", "Fine Dining"],
    phone: "(+250) 788 777 888",
    address: "KN 2 Ave, Kigali, Rwanda",
    website: "www.hutrestaurant.com",
    rating: 4.7,
    reviews: 234,
    hours: {
      regular: "Mon - Sun",
      schedule: "Open until 11:00 PM"
    },
    yearsInBusiness: 8,
    description: "The Hut Restaurant offers an exquisite dining experience featuring both continental and traditional Rwandan cuisine. Our menu showcases the finest local ingredients prepared by expert chefs. Perfect for romantic dinners, business meetings, and special celebrations.",
    extraPhones: ["(+250) 788 777 889"],
    accreditation: "Rwanda Restaurant Association, Food Safety Certified",
    otherLinks: ["www.hutrestaurant.com/menu", "www.hutrestaurant.com/reservations"],
    isOpen: true,
    openStatus: "OPEN until 11:00 PM",
    openDetails: "Today: Open until 11:00 PM"
  }
};

export const BusinessDetailPage = () => {
  const { city, category, businessId } = useParams();
  
  const formatTitle = (str: string) => {
    return str?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  const cityName = formatTitle(city || '');
  const categoryName = formatTitle(category || '');
  
  const business = businessDetails[Number(businessId) as keyof typeof businessDetails];
  
  if (!business) {
    return (
      <div className="min-h-screen bg-background font-sf-pro">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-yp-dark">Business not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sf-pro">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-yp-blue font-sf-text">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            <Link to={`/${city}/${category}`} className="hover:underline">
              {categoryName}, {cityName}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <Phone className="w-8 h-8 text-yp-dark mx-auto mb-2" />
                <div className="text-2xl font-semibold text-yp-dark font-sf-pro">
                  {business.phone}
                </div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-yp-blue hover:bg-yp-blue/90 text-white font-sf-text">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
                
                <Button variant="outline" className="w-full font-sf-text">
                  <Star className="w-4 h-4 mr-2" />
                  Write a Review
                </Button>
              </div>
            </div>

            {/* Is this your business? */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-3">
                <Building className="w-6 h-6 text-gray-400 mr-3" />
                <h3 className="font-semibold text-yp-dark font-sf-pro">Is this your business?</h3>
              </div>
              <p className="text-sm text-gray-600 font-sf-text mb-3">Customize this page</p>
              <Button className="w-full bg-yp-blue hover:bg-yp-blue/90 text-white font-sf-text">
                Claim This Business
              </Button>
            </div>

            {/* Hours */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-yp-dark font-sf-pro mb-4">Hours</h3>
              <div className="space-y-2">
                <div className="text-sm font-sf-text">
                  <span className="font-medium">Regular Hours</span>
                </div>
                <div className="flex justify-between text-sm font-sf-text">
                  <span>{business.hours.regular}</span>
                  <span>{business.hours.schedule}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-yp-dark font-sf-pro mb-2">
                {business.name}
              </h1>
              <p className="text-lg text-gray-600 font-sf-text mb-3">
                {business.subcategories.join(", ")}
              </p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(business.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-blue-600 font-sf-text cursor-pointer hover:underline">
                    Be the first to review!
                  </span>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-green-600 font-sf-text">
                  {business.openStatus}
                </span>
                <span className="text-gray-600 font-sf-text ml-2">
                  {business.openDetails}
                </span>
              </div>

              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600 font-sf-text">
                  {business.yearsInBusiness} Years in Business
                </span>
              </div>
            </div>

            {/* More Info Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-yp-dark font-sf-pro mb-4">More Info</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-yp-dark font-sf-pro mb-2">General Info</h3>
                  <p className="text-sm text-gray-600 font-sf-text leading-relaxed">
                    {business.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-yp-dark font-sf-pro mb-2">Extra Phones</h3>
                  <div className="space-y-1">
                    {business.extraPhones.map((phone, index) => (
                      <p key={index} className="text-sm text-gray-600 font-sf-text">
                        toll free: {phone}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-yp-dark font-sf-pro mb-2">Accreditation</h3>
                  <p className="text-sm text-gray-600 font-sf-text">
                    {business.accreditation}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-yp-dark font-sf-pro mb-2">Other Link</h3>
                  <div className="space-y-1">
                    {business.otherLinks.map((link, index) => (
                      <a key={index} href={`https://${link}`} className="block text-sm text-yp-blue hover:underline font-sf-text">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-yp-dark font-sf-pro mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {business.subcategories.map((category, index) => (
                      <a key={index} href="#" className="text-sm text-yp-blue hover:underline font-sf-text">
                        {category}
                      </a>
                    )).reduce((prev, curr, index) => 
                      index === 0 ? [curr] : [...prev, <span key={`sep-${index}`} className="text-gray-400">, </span>, curr], 
                      [] as React.ReactNode[]
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-yp-dark font-sf-pro">Gallery</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 font-sf-text">Be the first to add a photo!</span>
                  <Button variant="outline" size="sm" className="font-sf-text">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm font-sf-text">No photos available</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yp-dark font-sf-pro mb-4">Reviews</h2>
              <div className="text-center py-8">
                <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-gray-300" />
                  ))}
                </div>
                <p className="text-gray-600 font-sf-text mb-4">Be the first to review this business!</p>
                <Button className="bg-yp-blue hover:bg-yp-blue/90 text-white font-sf-text">
                  Write the First Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};