import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Star,
  MessageSquare,
  User,
  Building2,
  Flag,
  MoreHorizontal
} from "lucide-react";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_id: string;
  user_email?: string;
  business_id: string;
  business_name?: string;
  business_category?: string;
  city_name?: string;
  country_name?: string;
  is_flagged: boolean;
  flag_reason?: string;
}

export const AdminReviews = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await db
        .reviews()
        .select(`
          *,
          users!inner(email),
          businesses!inner(name, categories!inner(name, slug), cities!inner(name, countries!inner(name)))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const reviewsWithDetails = data?.map(review => ({
        ...review,
        user_email: review.users?.email,
        business_name: review.businesses?.name,
        business_category: review.businesses?.categories?.name,
        city_name: review.businesses?.cities?.name,
        country_name: review.businesses?.cities?.countries?.name
      })) || [];
      
      setReviews(reviewsWithDetails);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const { error } = await db
        .reviews()
        .update({ status: newStatus })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Review status updated to ${newStatus}`,
      });

      fetchReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive"
      });
    }
  };

  const handleFlagReview = async (reviewId: string, reason: string) => {
    try {
      const { error } = await db
        .reviews()
        .update({ 
          is_flagged: true, 
          flag_reason: reason 
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review flagged successfully",
      });

      fetchReviews();
    } catch (error) {
      console.error('Error flagging review:', error);
      toast({
        title: "Error",
        description: "Failed to flag review",
        variant: "destructive"
      });
    }
  };

  const openViewDialog = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  if (loading) {
    return (
      <AdminLayout title="Reviews Management" subtitle="Moderate and manage user reviews">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reviews Management" subtitle="Moderate and manage user reviews">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Total Reviews</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Pending</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">
                  {reviews.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Approved</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">
                  {reviews.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flag className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Flagged</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">
                  {reviews.filter(r => r.is_flagged).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reviews..."
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
                <SelectItem value="pending" className="font-roboto">Pending</SelectItem>
                <SelectItem value="approved" className="font-roboto">Approved</SelectItem>
                <SelectItem value="rejected" className="font-roboto">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="font-roboto">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-roboto">All Ratings</SelectItem>
                <SelectItem value="5" className="font-roboto">5 Stars</SelectItem>
                <SelectItem value="4" className="font-roboto">4 Stars</SelectItem>
                <SelectItem value="3" className="font-roboto">3 Stars</SelectItem>
                <SelectItem value="2" className="font-roboto">2 Stars</SelectItem>
                <SelectItem value="1" className="font-roboto">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="self-center justify-center">
              {filteredReviews.length} reviews
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`font-roboto ${getStatusColor(review.status)}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(review.status)}
                        <span className="capitalize">{review.status}</span>
                      </div>
                    </Badge>
                    {review.is_flagged && (
                      <Badge variant="destructive" className="font-roboto">
                        <Flag className="w-3 h-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>

                  {/* Review Title and Content */}
                  <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h3>
                  <p className="text-gray-700 font-roboto mb-4 line-clamp-3">
                    {review.content}
                  </p>

                  {/* Review Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 font-roboto">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{review.user_email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>{review.business_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="mt-3 text-sm text-gray-500 font-roboto">
                    <span>{review.business_category}</span>
                    {review.city_name && (
                      <span className="mx-2">•</span>
                    )}
                    {review.city_name && (
                      <span>{review.city_name}, {review.country_name}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewDialog(review)}
                    className="font-roboto"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  
                  {review.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="text-green-600 border-green-200 hover:bg-green-50 font-roboto"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="text-red-600 border-red-200 hover:bg-red-50 font-roboto"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {!review.is_flagged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagReview(review.id, 'Inappropriate content')}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50 font-roboto"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredReviews.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
              No reviews found
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