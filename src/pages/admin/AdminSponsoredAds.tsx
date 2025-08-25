import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play,
  DollarSign,
  Target,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface AdCampaign {
  id: string;
  business_id: string;
  business_name: string;
  campaign_name: string;
  campaign_type: 'featured_listing' | 'top_position' | 'sidebar';
  target_cities: string[];
  target_categories: string[];
  start_date: string;
  end_date: string;
  budget: number;
  spent_amount: number;
  daily_budget_limit?: number;
  is_active: boolean;
  admin_approved: boolean;
  admin_notes?: string;
  performance_metrics?: any;
  created_at: string;
  updated_at: string;
}

export const AdminSponsoredAds = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const mockCampaigns: AdCampaign[] = [
    {
      id: '1',
      business_id: 'business-1',
      business_name: 'Premium Restaurant',
      campaign_name: 'Summer Restaurant Promotion',
      campaign_type: 'featured_listing',
      target_cities: ['kigali', 'nairobi', 'kampala'],
      target_categories: ['restaurant', 'food'],
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      budget: 500.00,
      spent_amount: 125.50,
      daily_budget_limit: 25.00,
      is_active: true,
      admin_approved: true,
      admin_notes: 'Approved for summer season',
      performance_metrics: {
        impressions: 1250,
        clicks: 89,
        ctr: 7.12,
        avg_cpc: 1.41
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApproveCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, admin_approved: true, is_active: true }
        : campaign
    ));
    
    toast({
      title: 'Campaign Approved',
      description: 'The campaign has been approved and activated.',
    });
  };

  const getStatusBadge = (campaign: AdCampaign) => {
    if (!campaign.admin_approved) {
      return <Badge variant="secondary">Pending</Badge>;
    }
    if (!campaign.is_active) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yp-gray-light">
      <Header />
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-yp-dark mb-2">
              Sponsored Advertising Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor sponsored advertising campaigns
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-yp-dark">
                      ${campaigns.reduce((sum, c) => sum + c.spent_amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                    <p className="text-2xl font-bold text-yp-dark">
                      {campaigns.filter(c => c.is_active && c.admin_approved).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-yp-dark">
                      {campaigns.filter(c => !c.admin_approved).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-yp-dark">
                          {campaign.campaign_name}
                        </h3>
                        {getStatusBadge(campaign)}
                        <Badge variant="outline">
                          {campaign.campaign_type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Business</p>
                          <p className="text-sm text-gray-900">{campaign.business_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Budget</p>
                          <p className="text-sm text-gray-900">
                            ${campaign.spent_amount.toFixed(2)} / ${campaign.budget.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Duration</p>
                          <p className="text-sm text-gray-900">
                            {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>

                      {!campaign.admin_approved ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApproveCampaign(campaign.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      ) : (
                        <Button
                          variant={campaign.is_active ? "destructive" : "default"}
                          size="sm"
                        >
                          {campaign.is_active ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
