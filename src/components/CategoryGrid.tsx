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
import { useNavigate } from "react-router-dom";

const categories = [
  // { 
  //   name: "Find People", 
  //   icon: Users, 
  //   link: "/find-people",
  //   cities: ["Kigali", "Cairo", "Nairobi", "Cape Town", "Harare"]
  // },
  { 
    name: "Restaurants", 
    icon: UtensilsCrossed, 
    link: "/restaurants",
    cities: ["Kigali", "Mbarara", "Dodoma", "Addis Ababa", "Durban"]
  },
  { 
    name: "Dentists", 
    icon: Stethoscope, 
    link: "/dentists",
    cities: ["Abuja", "Cairo", "Nairobi", "Cape Town", "Kigali"]
  },
  { 
    name: "Plumbers", 
    icon: Wrench, 
    link: "/plumbers",
    cities: ["Harare", "Mbarara", "Dodoma", "Durban", "Abuja"]
  },
  { 
    name: "Contractors", 
    icon: HardHat, 
    link: "/contractors",
    cities: ["Addis Ababa", "Nairobi", "Cape Town", "Kigali", "Cairo"]
  },
  { 
    name: "Electricians", 
    icon: Zap, 
    link: "/electricians",
    cities: ["Durban", "Harare", "Mbarara", "Dodoma", "Abuja"]
  },
  { 
    name: "Auto Repair", 
    icon: Car, 
    link: "/auto-repair",
    cities: ["Cairo", "Addis Ababa", "Nairobi", "Cape Town", "Kigali"]
  },
  { 
    name: "Roofing", 
    icon: Home, 
    link: "/roofing",
    cities: ["Abuja", "Durban", "Harare", "Mbarara", "Dodoma"]
  },
  { 
    name: "Attorneys", 
    icon: Scale, 
    link: "/attorneys",
    cities: ["Kigali", "Cairo", "Nairobi", "Cape Town", "Addis Ababa"]
  },
  { 
    name: "Hotels", 
    icon: Bed, 
    link: "/hotels",
    cities: ["Harare", "Mbarara", "Dodoma", "Durban", "Abuja"]
  }
];

export const CategoryGrid = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (category: string, city: string) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${citySlug}/${categorySlug}`);
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-6">
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