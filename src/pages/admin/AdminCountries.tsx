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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Globe, 
  MapPin,
  Users,
  Building2
} from "lucide-react";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji?: string;
  is_active: boolean;
  created_at: string;
  city_count?: number;
  business_count?: number;
}

export const AdminCountries = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    flag_emoji: "",
    is_active: true
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {  
    try {
      // Fetch countries with counts
      const { data, error } = await db
        .countries()
        .select(`
          *,
          cities!inner(count),
          businesses!inner(count)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const countriesWithCounts = data?.map(country => ({
        ...country,
        city_count: country.cities?.length || 0,
        business_count: country.businesses?.length || 0
      })) || [];
      
      setCountries(countriesWithCounts);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch countries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCountry = async () => {
    try {
      const { error } = await db
        .countries()
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country added successfully",
      });

      setIsAddDialogOpen(false);
      setFormData({ name: "", code: "", flag_emoji: "", is_active: true });
      fetchCountries();
    } catch (error) {
      console.error('Error adding country:', error);
      toast({
        title: "Error",
        description: "Failed to add country",
        variant: "destructive"
      });
    }
  };

  const handleEditCountry = async () => {
    if (!selectedCountry) return;

    try {
      const { error } = await db
        .countries()
        .update(formData)
        .eq('id', selectedCountry.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedCountry(null);
      setFormData({ name: "", code: "", flag_emoji: "", is_active: true });
      fetchCountries();
    } catch (error) {
      console.error('Error updating country:', error);
      toast({
        title: "Error",
        description: "Failed to update country",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCountry = async (countryId: string) => {
    if (!confirm('Are you sure you want to delete this country? This will also affect all associated cities and businesses.')) return;

    try {
      const { error } = await db
        .countries()
        .update({ is_active: false })
        .eq('id', countryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country deleted successfully",
      });

      fetchCountries();
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: "Error",
        description: "Failed to delete country",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (country: Country) => {
    setSelectedCountry(country);
    setFormData({
      name: country.name,
      code: country.code,
      flag_emoji: country.flag_emoji || "",
      is_active: country.is_active
    });
    setIsEditDialogOpen(true);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Countries Management" subtitle="Manage countries and regions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Countries Management" subtitle="Manage countries and regions">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">Countries</h2>
          <p className="text-gray-600 font-roboto">Manage countries and their regions</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yp-blue">
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-comfortaa">Add New Country</DialogTitle>
              <DialogDescription className="font-roboto">
                Create a new country entry for your platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="country-name" className="font-roboto">Country Name</Label>
                <Input
                  id="country-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter country name"
                  className="font-roboto"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country-code" className="font-roboto">Country Code</Label>
                <Input
                  id="country-code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., RW, KE, UG"
                  className="font-roboto"
                  maxLength={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flag-emoji" className="font-roboto">Flag Emoji (Optional)</Label>
                <Input
                  id="flag-emoji"
                  value={formData.flag_emoji}
                  onChange={(e) => setFormData(prev => ({ ...prev, flag_emoji: e.target.value }))}
                  placeholder="🇷🇼 🇰🇪 🇺🇬"
                  className="font-roboto"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="font-roboto">
                Cancel
              </Button>
              <Button onClick={handleAddCountry} className="font-roboto">
                Add Country
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
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-roboto"
              />
            </div>
            <Badge variant="secondary" className="self-center">
              {filteredCountries.length} countries
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <Card key={country.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{country.flag_emoji || "🌍"}</div>
                  <div>
                    <CardTitle className="text-lg font-comfortaa">{country.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-roboto text-gray-600">{country.code}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(country)}
                    className="p-1 h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCountry(country.id)}
                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-roboto">{country.city_count || 0} cities</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="font-roboto">{country.business_count || 0} businesses</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 font-roboto">
                <span>Added: {new Date(country.created_at).toLocaleDateString()}</span>
                <Badge variant={country.is_active ? "default" : "secondary"}>
                  {country.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCountries.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <CardContent>
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
              No countries found
            </h3>
            <p className="text-gray-600 font-roboto">
              Try adjusting your search terms or add a new country.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-comfortaa">Edit Country</DialogTitle>
            <DialogDescription className="font-roboto">
              Update country information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-country-name" className="font-roboto">Country Name</Label>
              <Input
                id="edit-country-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter country name"
                className="font-roboto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-country-code" className="font-roboto">Country Code</Label>
              <Input
                id="edit-country-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., RW, KE, UG"
                className="font-roboto"
                maxLength={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-flag-emoji" className="font-roboto">Flag Emoji (Optional)</Label>
              <Input
                id="edit-flag-emoji"
                value={formData.flag_emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, flag_emoji: e.target.value }))}
                placeholder="🇷🇼 🇰🇪 🇺🇬"
                className="font-roboto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="font-roboto">
              Cancel
            </Button>
            <Button onClick={handleEditCountry} className="font-roboto">
              Update Country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};