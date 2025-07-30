import { 
  Users, 
  UtensilsCrossed, 
  Stethoscope, 
  Wrench, 
  HardHat, 
  Zap, 
  Car, 
  Home, 
  Scale, 
  Bed 
} from "lucide-react";

const categories = [
  { 
    name: "Find People", 
    icon: Users, 
    link: "/find-people",
    cities: ["Atlanta", "New York", "Los Angeles", "Chicago", "Houston"]
  },
  { 
    name: "Restaurants", 
    icon: UtensilsCrossed, 
    link: "/restaurants",
    cities: ["Atlanta", "Miami", "San Francisco", "Boston", "Seattle"]
  },
  { 
    name: "Dentists", 
    icon: Stethoscope, 
    link: "/dentists",
    cities: ["", "Denver", "Phoenix", "Portland", "Austin"]
  },
  { 
    name: "Plumbers", 
    icon: Wrench, 
    link: "/plumbers",
    cities: ["Las Vegas", "Nashville", "Orlando", "Tampa", "Memphis"]
  },
  { 
    name: "Contractors", 
    icon: HardHat, 
    link: "/contractors",
    cities: ["Charlotte", "Jacksonville", "Indianapolis", "Columbus", "San Jose"]
  },
  { 
    name: "Electricians", 
    icon: Zap, 
    link: "/electricians",
    cities: ["Fort Worth", "Detroit", "El Paso", "Milwaukee", "Baltimore"]
  },
  { 
    name: "Auto Repair", 
    icon: Car, 
    link: "/auto-repair",
    cities: ["Washington", "Louisville", "Oklahoma City", "Tucson", "Fresno"]
  },
  { 
    name: "Roofing", 
    icon: Home, 
    link: "/roofing",
    cities: ["Sacramento", "Kansas City", "Mesa", "Virginia Beach", "Colorado Springs"]
  },
  { 
    name: "Attorneys", 
    icon: Scale, 
    link: "/attorneys",
    cities: ["Omaha", "Raleigh", "Long Beach", "Miami", "Virginia Beach"]
  },
  { 
    name: "Hotels", 
    icon: Bed, 
    link: "/hotels",
    cities: ["Oakland", "Minneapolis", "Tulsa", "Wichita", "New Orleans"]
  }
];

export const CategoryGrid = () => {
  const handleCategoryClick = (category: string, city: string) => {
    console.log(`Navigating to ${category} in ${city}`);
    // Navigation logic would be implemented here
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.name} className="text-center">
                <button 
                  onClick={() => handleCategoryClick(category.name, category.cities[0])}
                  className="w-16 h-16 mx-auto mb-3 bg-white border-2 border-yp-gray-medium rounded-full flex items-center justify-center hover:border-yp-blue hover:bg-yp-gray-light transition-all duration-200 group"
                >
                  <IconComponent className="w-8 h-8 text-yp-gray-dark group-hover:text-yp-blue" />
                </button>
                <h3 className="font-sf-text font-medium text-sm text-yp-dark mb-2">
                  {category.name}
                </h3>
                
                {/* City Links */}
                <div className="space-y-1">
                  {category.cities.slice(0, 3).map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCategoryClick(category.name, city)}
                      className="block text-xs text-yp-blue hover:underline font-sf-text w-full"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};