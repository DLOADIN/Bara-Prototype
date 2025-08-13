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
  MoreHorizontal
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
  'utilities': Zap
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await db.categories()
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(10); // Limit to 10 categories for the grid

        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          setCategories(data || []);
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

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue mx-auto"></div>
            <p className="mt-2 text-yp-gray-dark">{t('common.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-sf-pro font-bold text-yp-dark text-center mb-8">
          {t('homepage.categories.title')}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.slug] || Home;
            const translatedName = t(`categories.${category.slug}`);
            
            return (
              <div key={category.id} className="text-center flex-none">
                <button 
                  onClick={() => handleCategoryClick(category.slug)}
                  className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 bg-white border-2 border-yp-gray-medium rounded-full flex items-center justify-center hover:border-yp-blue hover:bg-yp-gray-light transition-all duration-200 group"
                >
                  <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-yp-gray-dark group-hover:text-yp-blue" />
                </button>
                <h3 className="font-sf-text font-medium text-xs md:text-sm text-yp-dark mb-2">
                  {translatedName}
                </h3>
              </div>
            );
          })}
          
          {/* More Categories Button */}
          <div className="text-center flex-none">
            <button 
              onClick={handleViewAllCategories}
              className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 bg-white border-2 border-yp-gray-medium rounded-full flex items-center justify-center hover:border-yp-blue hover:bg-yp-gray-light transition-all duration-200 group"
            >
              <MoreHorizontal className="w-6 h-6 md:w-8 md:h-8 text-yp-gray-dark group-hover:text-yp-blue" />
            </button>
            <h3 className="font-sf-text font-medium text-xs md:text-sm text-yp-dark mb-2">
              {t('homepage.categories.viewMore')}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};