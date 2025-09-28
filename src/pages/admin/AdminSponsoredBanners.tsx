import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building, 
  Globe, 
  Eye, 
  MousePointer, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Mail,
  Phone,
  Plus
} from 'lucide-react';
import { useSponsoredBanners } from '@/hooks/useSponsoredBanners';
import { useToast } from '@/hooks/use-toast';
import { deleteImage, uploadImage } from '@/lib/storage';
import { SponsoredBanner } from '@/types/sponsoredBanner.types';
import { supabase } from '@/lib/supabase';
import { Switch } from '@/components/ui/switch';

export const AdminSponsoredBanners: React.FC = () => {
  const { toast } = useToast();
  const { 
    banners, 
    loading, 
    error, 
    fetchBanners, 
    updateBanner, 
    deleteBanner,
    createBanner
  } = useSponsoredBanners();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBanner, setSelectedBanner] = useState<SponsoredBanner | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Add Banner dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [countries, setCountries] = useState<Array<{ id: string; name: string; code: string; flag_url?: string }>>([]);
  const [adding, setAdding] = useState(false);
  const [newBannerImage, setNewBannerImage] = useState<File | null>(null);
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('');
  const [newForm, setNewForm] = useState({
    company_name: '',
    company_website: '',
    banner_alt_text: '',
    country_id: '',
    payment_status: 'paid' as 'pending' | 'paid' | 'failed' | 'refunded',
    status: 'pending' as 'pending' | 'approved' | 'rejected' | 'active' | 'inactive',
    payment_amount: 25 as number | undefined,
  });

  // Analytics state
  const [bannerAnalytics, setBannerAnalytics] = useState<Record<string, {
    total_views: number;
    total_clicks: number;
    click_through_rate: number;
    recent_views: number;
    recent_clicks: number;
  }>>({});
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    fetchBanners(true); // Admin mode
  }, []);

  // Fetch analytics data when banners change
  useEffect(() => {
    if (banners.length > 0) {
      fetchBannerAnalytics();
    }
  }, [banners]);

  const fetchBannerAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const analyticsData: Record<string, any> = {};
      
      // Simplified analytics - use data from the banner itself
      banners.forEach((banner) => {
        analyticsData[banner.id] = {
          total_views: banner.view_count || 0,
          total_clicks: banner.click_count || 0,
          click_through_rate: banner.view_count > 0 ? ((banner.click_count || 0) / banner.view_count) * 100 : 0,
          recent_views: 0, // Can be implemented later
          recent_clicks: 0, // Can be implemented later
        };
      });
      
      setBannerAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching banner analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Load countries for the add dialog
  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from('countries')
        .select('id, name, code, flag_url')
        .order('name');
      if (!err) setCountries(data || []);
    })();
  }, []);

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = 
      banner.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.country_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || banner.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (bannerId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === 'approved' || newStatus === 'active') {
        updates.approved_at = new Date().toISOString();
        updates.approved_by = 'admin'; // In real implementation, get from auth
      }
      
      await updateBanner(bannerId, updates);
      
      toast({
        title: "Status Updated",
        description: `Banner status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (banner: SponsoredBanner) => {
    try {
      const newValue = !banner.is_active;
      await updateBanner(banner.id, { is_active: newValue } as any);
      toast({
        title: newValue ? 'Activated' : 'Deactivated',
        description: `Banner ${newValue ? 'is now active' : 'has been deactivated'}`,
      });
    } catch (error) {
      console.error('Error toggling active state:', error);
      toast({
        title: 'Error',
        description: 'Failed to update active state',
        variant: 'destructive',
      });
    }
  };

  const handleAddNotes = async (bannerId: string) => {
    try {
      await updateBanner(bannerId, { admin_notes: adminNotes } as any);
      setAdminNotes('');
      setShowDetails(false);
      
      toast({
        title: "Notes Added",
        description: "Admin notes have been saved",
      });
    } catch (error) {
      console.error('Error adding notes:', error);
      toast({
        title: "Error",
        description: "Failed to add notes",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        // Find the banner to get the image path
        const banner = banners.find(b => b.id === bannerId);
        
        // Delete the banner from database
        await deleteBanner(bannerId);
        
        // Delete the image from storage if it exists
        if (banner?.banner_image_url) {
          // Extract path from URL (remove domain part)
          const url = new URL(banner.banner_image_url);
          const path = url.pathname.split('/').slice(3).join('/'); // Remove /storage/v1/object/public/
          await deleteImage(path, 'sponsored-banners');
        }
        
        toast({
          title: "Banner Deleted",
          description: "The sponsored banner and its image have been deleted",
        });
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast({
          title: "Error",
          description: "Failed to delete banner",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    // Handle undefined/null status
    if (!status) {
      status = 'pending';
    }
    
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    // Handle undefined/null status
    if (!status) {
      status = 'pending';
    }
    
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800' },
      paid: { color: 'bg-green-100 text-green-800' },
      failed: { color: 'bg-red-100 text-red-800' },
      refunded: { color: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-300 rounded w-full animate-pulse"></div>
          <div className="h-64 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sponsored Banners</h1>
            <p className="text-gray-600">Manage country page sponsored banners displayed on the Homepage</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {filteredBanners.length} banner{filteredBanners.length !== 1 ? 's' : ''}
            </div>
            <Button 
              onClick={fetchBannerAnalytics} 
              variant="outline" 
              disabled={loadingAnalytics}
              className="flex justify-center items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              {loadingAnalytics ? 'Refreshing...' : 'Refresh Stats'}
            </Button>
            <Button onClick={() => setShowAddDialog(true)} className="bg-yellow-900 hover:bg-blue-600 text-white flex justify-center items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by company, email, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banners Table */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {filteredBanners.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria' 
                    : 'No sponsored banners have been submitted yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{banner.company_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              {banner.company_website}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {banner.country_flag_url && (
                              <img 
                                src={banner.country_flag_url} 
                                alt={banner.country_name}
                                className="w-4 h-3"
                              />
                            )}
                            <span>{banner.country_name}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium">{banner.contact_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {banner.contact_email || 'N/A'}
                            </div>
                            {banner.contact_phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {banner.contact_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            {getPaymentStatusBadge(banner.payment_status)}
                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${banner.payment_amount || 0}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {getStatusBadge(banner.status)}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={!!banner.is_active}
                              onCheckedChange={() => handleToggleActive(banner)}
                            />
                            <span className={`text-sm font-medium ${banner.is_active ? 'text-green-700' : 'text-red-600'}`}>
                              {banner.is_active ? 'On' : 'Off'}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {loadingAnalytics ? (
                              <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                              </div>
                            ) : (
                              <>
                            <div className="flex items-center text-gray-600">
                              <Eye className="w-3 h-3 mr-1" />
                                  {bannerAnalytics[banner.id]?.total_views || 0} views
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MousePointer className="w-3 h-3 mr-1" />
                                  {bannerAnalytics[banner.id]?.total_clicks || 0} clicks
                                </div>
                                {bannerAnalytics[banner.id]?.click_through_rate > 0 && (
                                  <div className="text-xs text-blue-600 font-medium">
                                    {bannerAnalytics[banner.id].click_through_rate}% CTR
                            </div>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBanner(banner);
                                setAdminNotes(banner.admin_notes || '');
                                setShowDetails(true);
                              }}
                            >
                              View
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Banner Details Modal */}
        {showDetails && selectedBanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Banner Details
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner Image */}
                <div>
                  <h4 className="font-medium mb-2">Banner Image</h4>
                  <img 
                    src={selectedBanner.banner_image_url} 
                    alt={selectedBanner.banner_alt_text || selectedBanner.company_name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Company Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedBanner.company_name}</div>
                      <div><strong>Website:</strong> {selectedBanner.company_website}</div>
                      <div><strong>Alt Text:</strong> {selectedBanner.banner_alt_text || 'None'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Target Country</h4>
                    <div className="flex items-center space-x-2">
                      {selectedBanner.country_flag_url && (
                        <img 
                          src={selectedBanner.country_flag_url} 
                          alt={selectedBanner.country_name}
                          className="w-6 h-4"
                        />
                      )}
                      <span>{selectedBanner.country_name}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {selectedBanner.contact_name}</div>
                    <div><strong>Email:</strong> {selectedBanner.contact_email}</div>
                    <div><strong>Phone:</strong> {selectedBanner.contact_phone || 'Not provided'}</div>
                    <div><strong>Submitted:</strong> {new Date(selectedBanner.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Status:</strong> {getPaymentStatusBadge(selectedBanner.payment_status)}</div>
                    <div><strong>Amount:</strong> ${selectedBanner.payment_amount}</div>
                    <div><strong>Reference:</strong> {(selectedBanner as any).payment_reference || 'None'}</div>
                    <div><strong>Current Status:</strong> {getStatusBadge(selectedBanner.status)}</div>
                  </div>
                </div>

                {/* Analytics Information */}
                <div>
                  <h4 className="font-medium mb-2">Analytics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-gray-500" />
                      <strong>Total Views:</strong> {bannerAnalytics[selectedBanner.id]?.total_views || 0}
                    </div>
                    <div className="flex items-center">
                      <MousePointer className="w-4 h-4 mr-2 text-gray-500" />
                      <strong>Total Clicks:</strong> {bannerAnalytics[selectedBanner.id]?.total_clicks || 0}
                    </div>
                    <div>
                      <strong>Click-Through Rate:</strong> {bannerAnalytics[selectedBanner.id]?.click_through_rate || 0}%
                    </div>
                    <div>
                      <strong>Recent Activity (7 days):</strong> {bannerAnalytics[selectedBanner.id]?.recent_views || 0} views, {bannerAnalytics[selectedBanner.id]?.recent_clicks || 0} clicks
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h4 className="font-medium mb-2">Admin Notes</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this banner submission..."
                    rows={3}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddNotes(selectedBanner.id)}
                  >
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Banner Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Sponsored Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <Input
                    value={newForm.company_name}
                    onChange={(e) => setNewForm((p) => ({ ...p, company_name: e.target.value }))}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website *</label>
                  <Input
                    type="url"
                    value={newForm.company_website}
                    onChange={(e) => setNewForm((p) => ({ ...p, company_website: e.target.value }))}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Country *</label>
                <Select
                  value={newForm.country_id}
                  onValueChange={(value) => setNewForm((p) => ({ ...p, country_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center space-x-2">
                          {c.flag_url && (<img src={c.flag_url} alt={c.name} className="w-4 h-3" />)}
                          <span>{c.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Banner Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {newBannerImageUrl ? (
                    <div className="space-y-3">
                      <img src={newBannerImageUrl} alt="Banner preview" className="max-h-32 mx-auto rounded" />
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewBannerImage(null);
                            setNewBannerImageUrl('');
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (!file) return;
                          const allowed = ['image/jpeg','image/png','image/gif','image/webp'];
                          if (!allowed.includes(file.type)) {
                            toast({ title: 'Invalid File Type', description: 'Upload JPEG, PNG, GIF, or WebP.', variant: 'destructive' });
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            toast({ title: 'File Too Large', description: 'Max 5MB.', variant: 'destructive' });
                            return;
                          }
                          setNewBannerImage(file);
                          setNewBannerImageUrl(URL.createObjectURL(file));
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Alt Text (Optional)</label>
                  <Input
                    value={newForm.banner_alt_text}
                    onChange={(e) => setNewForm((p) => ({ ...p, banner_alt_text: e.target.value }))}
                    placeholder="Describe your banner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Status</label>
                  <Select
                    value={newForm.payment_status}
                    onValueChange={(value) => setNewForm((p) => ({ ...p, payment_status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Banner Status</label>
                  <Select
                    value={newForm.status}
                    onValueChange={(value) => setNewForm((p) => ({ ...p, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Amount</label>
                  <Input
                    type="number"
                    value={newForm.payment_amount ?? ''}
                    onChange={(e) => setNewForm((p) => ({ ...p, payment_amount: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={adding}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!newForm.company_name || !newForm.company_website || !newForm.country_id) {
                      toast({ title: 'Missing Fields', description: 'Company, website, and country are required.', variant: 'destructive' });
                      return;
                    }
                    if (!newBannerImage) {
                      toast({ title: 'Image Required', description: 'Please upload a banner image.', variant: 'destructive' });
                      return;
                    }
                    try {
                      setAdding(true);
                      const bannerImageUrl = await uploadImage(newBannerImage, 'sponsored-banners', 'banners');
                      const payload: any = {
                        country_id: newForm.country_id,
                        company_name: newForm.company_name,
                        company_website: newForm.company_website,
                        banner_image_url: bannerImageUrl,
                        banner_alt_text: newForm.banner_alt_text,
                        payment_status: newForm.payment_status,
                      };
                      if (typeof newForm.payment_amount === 'number') payload.payment_amount = newForm.payment_amount;
                      if (newForm.status) payload.status = newForm.status;
                      await createBanner(payload);
                      toast({ title: 'Banner Added', description: 'Sponsored banner has been created.' });
                      setShowAddDialog(false);
                      setNewForm({ company_name: '', company_website: '', banner_alt_text: '', country_id: '', payment_status: 'paid', status: 'pending', payment_amount: 25 });
                      setNewBannerImage(null);
                      setNewBannerImageUrl('');
                      fetchBanners(true);
                    } catch (e) {
                      console.error(e);
                      toast({ title: 'Error', description: 'Failed to create banner.', variant: 'destructive' });
                    } finally {
                      setAdding(false);
                    }
                  }}
                  className="bg-green-600 text-white"
                  disabled={adding}
                >
                  {adding ? 'Saving...' : 'Save Banner'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};


