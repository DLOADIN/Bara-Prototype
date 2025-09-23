import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MousePointer
} from 'lucide-react';
import { supabase, getAdminDb } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type BannerAd = Database['public']['Tables']['banner_ads']['Row'];

// Create a type for the insert operation
type BannerAdInsert = Database['public']['Tables']['banner_ads']['Insert'];

// Create a type for the update operation
type BannerAdUpdate = Database['public']['Tables']['banner_ads']['Update'];

export const AdminBannerAds = () => {
  const { toast } = useToast();
  const [bannerAds, setBannerAds] = useState<BannerAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<BannerAd | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    redirect_url: '',
    alt_text: '',
    is_active: false,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchBannerAds();
  }, []);

  const fetchBannerAds = async () => {
    setLoading(true);
    try {
      console.log('Attempting to fetch banner ads...');
      
      const { data, error } = await supabase
        .from('banner_ads')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Banner ads query result:', { data, error });

      if (error) throw error;
      setBannerAds(data || []);
    } catch (error: any) {
      console.error('Error fetching banner ads:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch banner ads: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `banner-ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banner-ads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banner-ads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setUploading(false);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast({
        title: 'Error',
        description: 'Please upload an image for the banner',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      console.log('Attempting to save banner ad:', formData);
      
      const adData: BannerAdInsert = {
        title: formData.title,
        image_url: formData.image_url,
        redirect_url: formData.redirect_url,
        alt_text: formData.alt_text || null,
        is_active: formData.is_active,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        total_views: 0,
        total_clicks: 0
      };

      console.log('Prepared ad data:', adData);

      let result;
      if (editingAd) {
        // For update
        const { data, error } = await supabase
          .from('banner_ads')
          .update(adData as BannerAdUpdate)
          .eq('id', editingAd.id)
          .select();
        
        result = { data, error };
      } else {
        // For insert
        const { data, error } = await supabase
          .from('banner_ads')
          .insert(adData as BannerAdInsert)
          .select();
        
        result = { data, error };
      }

      console.log('Save result:', result);

      if (result.error) throw result.error;

      toast({
        title: 'Success',
        description: `Banner ad ${editingAd ? 'updated' : 'created'} successfully`
      });

      setIsDialogOpen(false);
      setEditingAd(null);
      resetForm();
      fetchBannerAds();
    } catch (error: any) {
      console.error('Error saving banner ad:', error);
      toast({
        title: 'Error',
        description: `Failed to save banner ad: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banner_ads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting banner ad:', error);
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Banner ad deleted successfully'
      });

      fetchBannerAds();
    } catch (error: any) {
      console.error('Error deleting banner ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete banner ad',
        variant: 'destructive'
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const adminDb = getAdminDb();
      const { error } = await adminDb.banner_ads()
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Banner ad ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchBannerAds();
    } catch (error: any) {
      console.error('Error toggling banner ad status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner ad status',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      redirect_url: '',
      alt_text: '',
      is_active: false,
      start_date: '',
      end_date: ''
    });
    setEditingAd(null);
  };

  const openEditDialog = (ad: BannerAd) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      image_url: ad.image_url,
      redirect_url: ad.redirect_url,
      alt_text: ad.alt_text || '',
      is_active: ad.is_active,
      start_date: ad.start_date ? ad.start_date.split('T')[0] : '',
      end_date: ad.end_date ? ad.end_date.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const calculateCTR = (views: number, clicks: number) => {
    if (views === 0) return '0%';
    return ((clicks / views) * 100).toFixed(2) + '%';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Banner Ads Management</h1>
            <p className="text-gray-600">Manage banner advertisements and track performance</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Banner Ad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAd ? 'Edit Banner Ad' : 'Create New Banner Ad'}
                </DialogTitle>
                <DialogDescription>
                  {editingAd ? 'Update the banner ad details' : 'Add a new banner advertisement'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="image">Banner Image</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        disabled={uploading}
                      />
                      <div className="text-sm text-gray-500">Or enter image URL:</div>
                      <Input
                        type="url"
                        placeholder="https://example.com/banner.jpg"
                        value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      />
                      {formData.image_url && (
                        <div className="border rounded p-2">
                          <img 
                            src={formData.image_url} 
                            alt="Preview" 
                            className="max-h-20 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="redirect_url">Redirect URL</Label>
                    <Input
                      id="redirect_url"
                      type="url"
                      value={formData.redirect_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, redirect_url: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="alt_text">Alt Text</Label>
                    <Input
                      id="alt_text"
                      value={formData.alt_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="start_date">Start Date (Optional)</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading || !formData.image_url}>
                    {uploading ? 'Uploading...' : editingAd ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bannerAds.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bannerAds.filter(ad => ad.is_active).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bannerAds.reduce((sum, ad) => sum + ad.total_views, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bannerAds.reduce((sum, ad) => sum + ad.total_clicks, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Banner Ads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Advertisements</CardTitle>
            <CardDescription>
              Manage your banner ads and track their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bannerAds.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <img 
                        src={ad.image_url} 
                        alt={ad.alt_text || ad.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{ad.title}</TableCell>
                    <TableCell>
                      <Badge variant={ad.is_active ? "default" : "secondary"}>
                        {ad.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{ad.total_views}</TableCell>
                    <TableCell>{ad.total_clicks}</TableCell>
                    <TableCell>{calculateCTR(ad.total_views, ad.total_clicks)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(ad.id, ad.is_active)}
                        >
                          {ad.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(ad)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ad.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
