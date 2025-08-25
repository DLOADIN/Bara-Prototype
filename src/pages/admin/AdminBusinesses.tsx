import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2, 
  MapPin,
  Globe,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  category_id: string;
  category_name?: string;
  city_id: string;
  city_name?: string;
  country_name?: string;
  status: 'active' | 'pending' | 'suspended';
  is_premium: boolean;
  is_verified: boolean;
  has_coupons: boolean;
  accepts_orders_online: boolean;
  is_kid_friendly: boolean;
  rating: number | null;
  review_count: number | null;
  created_at: string;
  owner_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface City {
  id: string;
  name: string;
  country_name?: string;
}

export const AdminBusinesses = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchBusinesses();
    fetchCategories();
    fetchCities();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await db
        .businesses()
        .select(`
          *,
          categories!inner(name, slug),
          cities!inner(name, countries!inner(name))
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const businessesWithDetails = data?.map(business => ({
        ...business,
        category_name: business.categories?.name,
        city_name: business.cities?.name,
        country_name: business.cities?.countries?.name
      })) || [];
      
      setBusinesses(businessesWithDetails);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch businesses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await db
        .categories()
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await db
        .cities()
        .select(`
          *,
          countries!inner(name)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const citiesWithCountries = data?.map(city => ({
        ...city,
        country_name: city.countries?.name
      })) || [];
      
      setCities(citiesWithCountries);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.city_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || business.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || business.category_id === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <AdminLayout title="Businesses Management" subtitle="Manage business listings and verifications">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Businesses Management" subtitle="Manage business listings and verifications">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">Businesses</h2>
          <p className="text-gray-600 font-roboto">Manage and moderate business listings</p>
        </div>
        
        <Button className="bg-yp-blue hover:bg-[#4e3c28]">
          <Plus className="w-4 h-4 mr-2" />
          Add Business
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-roboto"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="font-roboto">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-roboto">All Statuses</SelectItem>
                <SelectItem value="active" className="font-roboto">Active</SelectItem>
                <SelectItem value="pending" className="font-roboto">Pending</SelectItem>
                <SelectItem value="suspended" className="font-roboto">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="font-roboto">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-roboto">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="font-roboto">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="self-center justify-center">
              {filteredBusinesses.length} businesses
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-yp-blue" />
                  <div className="flex-1">
                    <CardTitle className="text-lg font-comfortaa line-clamp-2">{business.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-roboto text-gray-600">
                        {business.city_name}, {business.country_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-[#4e3c28]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {business.description && (
                <p className="text-sm font-roboto text-gray-600 mb-3 line-clamp-2">
                  {business.description}
                </p>
              )}
              
              {/* Business Features Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {business.is_premium && (
                  <Badge variant="default" className="text-xs bg-yp-blue">
                    Premium
                  </Badge>
                )}
                {business.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
                {business.has_coupons && (
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                    Coupons
                  </Badge>
                )}
                {business.accepts_orders_online && (
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                    Order Online
                  </Badge>
                )}
                {business.is_kid_friendly && (
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                    Kid Friendly
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-roboto">{business.rating?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="font-roboto">{business.review_count || 0} reviews</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className="font-roboto"
                >
                  <span className="capitalize">{business.status}</span>
                </Badge>
                <span className="text-xs font-roboto text-gray-500">
                  {new Date(business.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredBusinesses.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
              No businesses found
            </h3>
            <p className="text-gray-600 font-roboto">
              Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
};