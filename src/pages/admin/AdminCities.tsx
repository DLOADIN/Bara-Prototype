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
  MapPin, 
  Globe,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface City {
  id: string;
  name: string;
  country_id: string;
  country_name?: string;
  is_active: boolean;
  created_at: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
}

export const AdminCities = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    country_id: "",
    is_active: true
  });

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

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
      
      const citiesWithCountryNames = data?.map(city => ({
        ...city,
        country_name: city.countries?.name
      })) || [];
      
      setCities(citiesWithCountryNames);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await db
        .countries()
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleAddCity = async () => {
    try {
      const { error } = await db
        .cities()
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "City added successfully",
      });

      setIsAddDialogOpen(false);
      setFormData({ name: "", country_id: "", is_active: true });
      fetchCities();
    } catch (error) {
      console.error('Error adding city:', error);
      toast({
        title: "Error",
        description: "Failed to add city",
        variant: "destructive"
      });
    }
  };

  const handleEditCity = async () => {
    if (!selectedCity) return;

    try {
      const { error } = await db
        .cities()
        .update(formData)
        .eq('id', selectedCity.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "City updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedCity(null);
      setFormData({ name: "", country_id: "", is_active: true });
      fetchCities();
    } catch (error) {
      console.error('Error updating city:', error);
      toast({
        title: "Error",
        description: "Failed to update city",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;

    try {
      const { error } = await db
        .cities()
        .update({ is_active: false })
        .eq('id', cityId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "City deleted successfully",
      });

      fetchCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      toast({
        title: "Error",
        description: "Failed to delete city",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (city: City) => {
    setSelectedCity(city);
    setFormData({
      name: city.name,
      country_id: city.country_id,
      is_active: city.is_active
    });
    setIsEditDialogOpen(true);
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Cities Management" subtitle="Manage cities and locations">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cities Management" subtitle="Manage cities and locations">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">Cities</h2>
          <p className="text-gray-600 font-roboto">Manage cities across all countries</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yp-blue hover:bg-[#4e3c28]">
            <Plus className="w-4 h-4 mr-2" />
            Add City
          </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-comfortaa">Add New City</DialogTitle>
              <DialogDescription className="font-roboto">
                Create a new city entry for your platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="city-name" className="font-roboto">City Name</Label>
                <Input
                  id="city-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter city name"
                  className="font-roboto"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country" className="font-roboto">Country</Label>
                <Select value={formData.country_id} onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}>
                  <SelectTrigger className="font-roboto">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id} className="font-roboto">
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="font-roboto">
                Cancel
              </Button>
              <Button onClick={handleAddCity} className="font-roboto">
                Add City
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-roboto"
              />
            </div>
            <Badge variant="secondary" className="self-center">
              {filteredCities.length} cities
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <Card key={city.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-yp-blue" />
                  <div>
                    <CardTitle className="text-lg font-comfortaa">{city.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-roboto text-gray-600">{city.country_name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(city)}
                    className="p-1 h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCity(city.id)}
                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-[#4e3c28]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-500 font-roboto">
                <span>Added: {new Date(city.created_at).toLocaleDateString()}</span>
                <Badge variant={city.is_active ? "default" : "secondary"}>
                  {city.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCities.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
              No cities found
            </h3>
            <p className="text-gray-600 font-roboto">
              Try adjusting your search terms or add a new city.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-comfortaa">Edit City</DialogTitle>
            <DialogDescription className="font-roboto">
              Update city information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-city-name" className="font-roboto">City Name</Label>
              <Input
                id="edit-city-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter city name"
                className="font-roboto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-country" className="font-roboto">Country</Label>
              <Select value={formData.country_id} onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}>
                <SelectTrigger className="font-roboto">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id} className="font-roboto">
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="font-roboto">
              Cancel
            </Button>
            <Button onClick={handleEditCity} className="font-roboto">
              Update City
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};