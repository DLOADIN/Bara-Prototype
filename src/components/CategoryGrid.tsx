import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/supabase";
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
  Bed,
  Plane,
  Building,
  Wine,
  Scissors,
  BookOpen,
  Coffee,
  Film,
  Heart,
  Users as UsersIcon,
  User,
  Church,
  Leaf,
  Palette,
  Landmark,
  Hospital,
  Book,
  ShoppingBag,
  Building2,
  Trees,
  Pill,
  Mail,
  Gamepad2,
  GraduationCap,
  Truck,
  CreditCard,
  Smartphone,
  MoreHorizontal,
  ChevronUp,
  // Add missing icons
  Shield,
  Calculator,
  Megaphone,
  Briefcase,
  Camera,
  Calendar,
  Music,
  Sparkles,
  Dumbbell,
  Laptop
} from "lucide-react";

// Icon mapping for categories
const iconMap: { [key: string]: any } = {
  'airports': Plane,
  'banks': Building,
  'bars': Wine,
  'barbers': Scissors,
  'bookstores': BookOpen,
  'cafes': Coffee,
  'cinemas-theatres': Film,
  'clinics': Stethoscope,
  'clubs-professional': UsersIcon,
  'clubs-leisure': UsersIcon,
  'dentists': Stethoscope,
  'doctors': User,
  'faith': Church,
  'farms': Leaf,
  'galleries-art': Palette,
  'government': Landmark,
  'hospitals': Hospital,
  'hotels': Bed,
  'lawyers': Scale,
  'libraries': Book,
  'markets': ShoppingBag,
  'museums': Building2,
  'parks': Trees,
  'pharmacies': Pill,
  'post-offices': Mail,
  'recreation': Gamepad2,
  'real-estate': Home,
  'restaurants': UtensilsCrossed,
  'salons': Scissors,
  'schools': GraduationCap,
  'services': Wrench,
  'shopping': ShoppingBag,
  'tours': Car,
  'transportation': Truck,
  'universities': GraduationCap,
  'utilities': Zap,
  'auto-repair': Wrench,
  'coffee-shops': Coffee,
  'gyms-fitness': Dumbbell,
  'beauty-salons': Scissors,
  'pet-services': Heart,
  // Add missing categories
  'spas-wellness': Heart,
  'tech-services': Laptop,
  'car-dealerships': Car,
  'insurance': Shield,
  'accounting': Calculator,
  'marketing': Megaphone,
  'consulting': Briefcase,
  'photography': Camera,
  'event-planning': Calendar,
  'veterinary': Heart,
  'dance-studios': Music,
  'music-schools': Music,
  'language-schools': BookOpen,
  'driving-schools': Car,
  'security-services': Shield,
  'cleaning-services': Sparkles
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export const CategoryGrid = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [isExpanding, setIsExpanding] = useState(false);

  // Number of categories to show initially - increased to show more categories
  const INITIAL_CATEGORIES = 15; // Show 15 categories initially instead of 10
  const ANIMATION_DELAY = 100; // milliseconds between each category animation

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await db.categories()
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          console.log('Fetched categories:', data?.length, data); // Debug log
          setCategories(data || []);
          // Initially show more categories
          setVisibleCategories(data?.slice(0, INITIAL_CATEGORIES) || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  const handleViewAllCategories = () => {
    navigate('/categories');
  };

  const toggleCategories = async () => {
    if (showAll) {
      // Collapse to show fewer categories
      setIsExpanding(false);
      setShowAll(false);
      
      // Animate hiding categories one by one
      for (let i = visibleCategories.length - 1; i >= INITIAL_CATEGORIES; i--) {
        await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAY / 2));
        setVisibleCategories(prev => prev.slice(0, i));
      }
    } else {
      // Expand to show all categories
      setIsExpanding(true);
      setShowAll(true);
      
      // Animate showing categories one by one
      for (let i = INITIAL_CATEGORIES; i < categories.length; i++) {
        await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAY));
        setVisibleCategories(prev => [...prev, categories[i]]);
      }
      setIsExpanding(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4285F4] mx-auto"></div>
            <p className="mt-2 text-[#5F6368] font-roboto">{t('common.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Handle case where no categories are loaded
  if (categories.length === 0) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-comfortaa font-bold text-[#202124] text-center mb-8">
              {t('homepage.categories.title')}
            </h2>
            <div className="bg-[#F8F9FA] border border-[#E8EAED] rounded-lg p-6">
              <p className="text-[#202124] font-roboto">
                No categories found. Please check your database connection.
              </p>
              <p className="text-[#5F6368] font-roboto text-sm mt-2">
                Expected categories: Restaurants, Hotels, Banks, Hospitals, Schools, Shopping, Dentists, Auto Repair, Lawyers, Pharmacies, Museums, Coffee Shops, Gyms & Fitness, Beauty Salons, Pet Services, Airports, Bars, Clinics, Real Estate, Transportation
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Debug information
  console.log('Total categories:', categories.length);
  console.log('Visible categories:', visibleCategories.length);
  console.log('Show all:', showAll);
  console.log('Categories data:', categories.map(c => ({ slug: c.slug, name: c.name })));

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-comfortaa font-bold text-yp-dark text-center mb-6 sm:mb-8 px-2">
          {t('homepage.categories.title')}
        </h2>
        
        {/* Debug info - remove in production */}
        <div className="text-center mb-4 text-xs sm:text-sm text-gray-500">
          Showing {visibleCategories.length} of {categories.length} categories
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {visibleCategories.map((category, index) => {
            const IconComponent = iconMap[category.slug] || Home;
            // Use the category name directly if translation is not available
            const translatedName = t(`categories.${category.slug}`, { defaultValue: category.name });
            
            return (
              <div 
                key={category.id} 
                className="text-center flex-none animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <button 
                  onClick={() => handleCategoryClick(category.slug)}
                  className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-2 md:mb-3 bg-white border-2 border-[#E8EAED] rounded-2xl flex items-center justify-center hover:border-[#4285F4] hover:bg-white transition-all duration-300 group touch-manipulation shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center group-hover:bg-[#E8F0FE] transition-colors duration-300">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-[#4285F4] transition-colors duration-300" />
                  </div>
                </button>
                <h3 className="font-roboto font-medium text-xs sm:text-sm md:text-sm text-[#202124] mb-2 transition-colors duration-300 px-1 leading-tight">
                  {translatedName}
                </h3>
              </div>
            );
          })}
          
          {/* Toggle Button - only show if there are more categories to display */}
          {categories.length > INITIAL_CATEGORIES && (
            <div className="text-center flex-none animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
              <button 
                onClick={toggleCategories}
                disabled={isExpanding}
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-2 md:mb-3 bg-[#4285F4] rounded-2xl flex items-center justify-center hover:bg-[#3367D6] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isExpanding ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 border-b-2 border-white"></div>
                ) : showAll ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center group-hover:bg-[#E8F0FE] transition-colors duration-300">
                    <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-[#202124] group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center group-hover:bg-[#E8F0FE] transition-colors duration-300">
                    <MoreHorizontal className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-[#4285F4] group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
            </button>
              <h3 className="font-roboto font-medium text-xs sm:text-sm md:text-base text-yp-dark mb-2 transition-colors duration-300 px-1 leading-tight">
                {showAll ? t('homepage.categories.viewLess') : t('homepage.categories.viewMore')}
            </h3>
          </div>
          )}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={handleViewAllCategories}
            className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3.5 bg-[#4285F4] hover:bg-[#3367D6] text-white font-roboto font-medium rounded-lg transition-all duration-300 text-sm sm:text-base touch-manipulation shadow-sm hover:shadow-md"
          >
            <span>{t('homepage.categories.viewAllCategories')}</span>
            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 ml-2 rotate-90 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};