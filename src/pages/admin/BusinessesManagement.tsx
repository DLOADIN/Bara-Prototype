import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2, 
  MapPin,
  Filter,
  Star,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { db } from "@/lib/supabase";

interface Business {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city_id: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  city_name?: string;
  category_name?: string;
  rating?: number;
  reviews_count?: number;
}

interface City {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export const BusinessesManagement = () => {
  const { t } = useTranslation();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city_id: "",
    category_id: "",
    is_active: true
  });

  useEffect(() => {
    fetchBusinesses();
    fetchCities();
    fetchCategories();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await db.businesses()
        .select(`
          *,
          cities!inner(name),
          categories!inner(name)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching businesses:', error);
      } else {
        setBusinesses(data || []);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await db.cities()
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching cities:', error);
      } else {
        setCities(data || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await db.categories()
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddBusiness = async () => {
    try {
      const { error } = await db.businesses().insert([formData]);
      
      if (error) {
        console.error('Error adding business:', error);
      } else {
        setShowAddForm(false);
        setFormData({
          name: "",
          description: "",
          phone: "",
          email: "",
          website: "",
          address: "",
          city_id: "",
          category_id: "",
          is_active: true
        });
        fetchBusinesses();
      }
    } catch (error) {
      console.error('Error adding business:', error);
    }
  };

  const handleEditBusiness = async () => {
    if (!editingBusiness) return;

    try {
      const { error } = await db.businesses()
        .update(formData)
        .eq('id', editingBusiness.id);
      
      if (error) {
        console.error('Error updating business:', error);
      } else {
        setEditingBusiness(null);
        setFormData({
          name: "",
          description: "",
          phone: "",
          email: "",
          website: "",
          address: "",
          city_id: "",
          category_id: "",
          is_active: true
        });
        fetchBusinesses();
      }
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        const { error } = await db.businesses()
          .update({ is_active: false })
          .eq('id', businessId);
        
        if (error) {
          console.error('Error deleting business:', error);
        } else {
          fetchBusinesses();
        }
      } catch (error) {
        console.error('Error deleting business:', error);
      }
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = !selectedCity || business.city_id === selectedCity;
    const matchesCategory = !selectedCategory || business.category_id === selectedCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      city_id: "",
      category_id: "",
      is_active: true
    });
    setShowAddForm(false);
    setEditingBusiness(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-comfortaa font-bold text-gray-900">
              Businesses Management
            </h1>
            <p className="text-gray-600 font-roboto">
              Manage business listings and information
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-yp-blue"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Business
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yp-blue focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yp-blue focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {(showAddForm || editingBusiness) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-roboto">
                {editingBusiness ? 'Edit Business' : 'Add New Business'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Business Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yp-blue focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    City
                  </label>
                  <select
                    value={formData.city_id}
                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yp-blue focus:border-transparent"
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Website
                  </label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="Enter website URL"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Address
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter business description"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yp-blue focus:border-transparent font-roboto"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-yp-blue focus:ring-yp-blue"
                  />
                  <span className="text-sm font-roboto">Active</span>
                </label>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button 
                  onClick={editingBusiness ? handleEditBusiness : handleAddBusiness}
                  className="bg-yp-blue"
                >
                  {editingBusiness ? 'Update Business' : 'Add Business'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Businesses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-roboto">
              Businesses ({filteredBusinesses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Business</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusinesses.map((business) => (
                    <tr key={business.id} className="border-b border-gray-100 hover:bg-[#4e3c28]/10">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium font-roboto">{business.name}</div>
                            {business.description && (
                              <div className="text-sm text-gray-600 font-roboto truncate max-w-xs">
                                {business.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {business.categories?.name || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-roboto">{business.cities?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {business.phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="font-roboto">{business.phone}</span>
                            </div>
                          )}
                          {business.email && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="font-roboto">{business.email}</span>
                            </div>
                          )}
                          {business.website && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Globe className="w-3 h-3 text-gray-400" />
                              <span className="font-roboto truncate max-w-xs">{business.website}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={business.is_active ? "default" : "secondary"}>
                          {business.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingBusiness(business);
                              setFormData({
                                name: business.name,
                                description: business.description || "",
                                phone: business.phone || "",
                                email: business.email || "",
                                website: business.website || "",
                                address: business.address || "",
                                city_id: business.city_id,
                                category_id: business.category_id,
                                is_active: business.is_active
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBusiness(business.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 font-roboto mb-2">
                  No businesses found
                </h3>
                <p className="text-gray-600 font-roboto">
                  {searchTerm || selectedCity || selectedCategory
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by adding your first business'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};