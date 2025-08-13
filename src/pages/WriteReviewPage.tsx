import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Search, 
  Store, 
  MessageSquare, 
  FileText, 
  Star, 
  Phone, 
  Globe, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Camera,
  X
} from "lucide-react";
import { db, auth } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { BusinessImageUpload } from "@/components/BusinessImageUpload";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  category_id: string | null;
  status: 'pending' | 'active' | 'suspended' | 'premium';
  is_premium: boolean;
  is_verified: boolean;
  created_at: string;
  category?: {
    name: string;
    slug: string;
  };
  city?: {
    name: string;
  };
}

interface ReviewForm {
  business_id: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
}

export const WriteReviewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("Kigali, Rwanda");
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState<'search' | 'review'>('search');
  
  // Review form state
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    business_id: '',
    rating: 0,
    title: '',
    content: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Search businesses
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: t('reviews.searchError'),
        description: t('reviews.businessName') + " is required.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await db.businesses()
        .select(`
          *,
          category:categories(name, slug),
          city:cities(name)
        `)
        .ilike('name', `%${searchTerm}%`)
        .eq('status', 'active')
        .limit(10);

      if (error) {
        console.error('Search error:', error);
        toast({
          title: t('reviews.searchError'),
          description: t('reviews.searchFailed'),
          variant: "destructive"
        });
      } else {
        setSearchResults(data || []);
        if (data && data.length === 0) {
          toast({
            title: t('reviews.noResults'),
            description: t('reviews.noResults'),
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: t('reviews.searchError'),
        description: t('reviews.searchFailed'),
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Select business for review
  const handleSelectBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setReviewForm(prev => ({ ...prev, business_id: business.id }));
    setCurrentStep('review');
  };

  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ReviewForm, value: string | number | string[]) => {
    setReviewForm(prev => ({ ...prev, [field]: value }));
  };

  // Submit review
  const handleSubmitReview = async () => {
    // Validation
    if (!reviewForm.business_id) {
      toast({
        title: t('common.error'),
        description: t('reviews.selectBusiness'),
        variant: "destructive"
      });
      return;
    }

    if (reviewForm.rating === 0) {
      toast({
        title: t('common.error'),
        description: t('reviews.ratingRequired'),
        variant: "destructive"
      });
      return;
    }

    if (!reviewForm.title.trim()) {
      toast({
        title: t('common.error'),
        description: t('reviews.titleRequired'),
        variant: "destructive"
      });
      return;
    }

    if (!reviewForm.content.trim()) {
      toast({
        title: t('common.error'),
        description: t('reviews.contentRequired'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user } } = await auth.getUser();
      
      if (!user) {
        toast({
          title: t('auth.loginRequired'),
          description: t('reviews.loginRequired'),
          variant: "destructive"
        });
        return;
      }

      // Submit review
      const { error } = await db.reviews().insert({
        business_id: reviewForm.business_id,
        user_id: user.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content,
        images: reviewForm.images,
        status: 'pending'
      });

      if (error) {
        console.error('Review submission error:', error);
        toast({
          title: t('reviews.submissionError'),
          description: t('reviews.submissionFailed'),
          variant: "destructive"
        });
      } else {
        toast({
          title: t('reviews.reviewSubmitted'),
          description: t('reviews.reviewPending'),
          variant: "default"
        });
        
        // Reset form and go back to search
        setReviewForm({
          business_id: '',
          rating: 0,
          title: '',
          content: '',
          images: []
        });
        setSelectedBusiness(null);
        setCurrentStep('search');
        setSearchTerm('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast({
        title: t('reviews.submissionError'),
        description: t('reviews.submissionFailed'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to search
  const handleBackToSearch = () => {
    setCurrentStep('search');
    setSelectedBusiness(null);
    setReviewForm({
      business_id: '',
      rating: 0,
      title: '',
      content: '',
      images: []
    });
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Illustration placeholder */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-80 h-48 bg-gradient-to-br from-yp-yellow/20 to-yp-blue/20 rounded-lg flex items-center justify-center">
                <div className="flex space-x-4">
                  <div className="bg-yp-yellow p-4 rounded-lg">
                    <Store className="w-8 h-8 text-yp-dark" />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <MessageSquare className="w-8 h-8 text-yp-blue" />
                  </div>
                  <div className="bg-yp-yellow p-4 rounded-lg">
                    <FileText className="w-8 h-8 text-yp-dark" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-yp-dark mb-4 font-comfortaa">
            <span className="text-yp-blue">Review</span> a Business and Help Others!
          </h1>
          <p className="text-xl text-gray-600 mb-2 font-roboto">
            Other people need your help finding good businesses.
          </p>
          <p className="text-xl text-gray-600 mb-8 font-roboto">
            Write a review and share your experience.
          </p>
          
          {/* Search Form */}
          {currentStep === 'search' && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 mb-4 font-roboto">
                {t('reviews.searchBusiness')}
            </p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                    placeholder={t('reviews.businessName')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-base font-roboto"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                    placeholder={t('reviews.location')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 text-base font-roboto"
                />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-yp-yellow hover:bg-yp-yellow/90 text-yp-dark px-8 h-12 font-roboto font-semibold"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t('common.find')
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {currentStep === 'search' && searchResults.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold text-yp-dark mb-6 font-comfortaa">
            {t('reviews.selectBusiness')}
          </h2>
          <div className="grid gap-4">
            {searchResults.map((business) => (
              <Card 
                key={business.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectBusiness(business)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-yp-dark font-comfortaa mb-2">
                        {business.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 font-roboto mb-2">
                        {business.category && (
                          <Badge variant="secondary">{business.category.name}</Badge>
                        )}
                        {business.city && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {business.city.name}
                          </span>
                        )}
                      </div>
                      {business.address && (
                        <p className="text-sm text-gray-600 font-roboto mb-2">
                          {business.address}
                        </p>
                      )}
                      {business.phone && (
                        <p className="text-sm text-gray-600 font-roboto flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {business.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {business.is_premium && (
                        <Badge className="bg-yellow-500 text-white">Premium</Badge>
                      )}
                      {business.is_verified && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {currentStep === 'review' && selectedBusiness && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToSearch}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('reviews.backToSearch')}
            </Button>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-comfortaa">
                  Reviewing: {selectedBusiness.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 font-roboto">
                  {selectedBusiness.category && (
                    <div className="flex items-center">
                      <Store className="w-4 h-4 mr-2" />
                      {selectedBusiness.category.name}
                    </div>
                  )}
                  {selectedBusiness.address && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedBusiness.address}
                    </div>
                  )}
                  {selectedBusiness.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedBusiness.phone}
                    </div>
                  )}
                  {selectedBusiness.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      {selectedBusiness.website}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-comfortaa">{t('reviews.writeReview')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 font-roboto">
                  {t('reviews.rating')} *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingSelect(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || reviewForm.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600 font-roboto">
                    {reviewForm.rating > 0 && `${reviewForm.rating} ${t('reviews.outOf5')}`}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  {t('reviews.reviewTitle')} *
                </label>
                <Input
                  type="text"
                  placeholder={t('reviews.reviewTitle')}
                  value={reviewForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="font-roboto"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1 font-roboto">
                  {reviewForm.title.length}/100 {t('reviews.characterCount')}
                </p>
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  {t('reviews.reviewContent')} *
                </label>
                <Textarea
                  placeholder={t('reviews.reviewContent')}
                  value={reviewForm.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="font-roboto min-h-[120px]"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1 font-roboto">
                  {reviewForm.content.length}/1000 {t('reviews.characterCount')}
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Add Photos (Optional)
                </label>
                <BusinessImageUpload
                  businessId={selectedBusiness.id}
                  onImagesChange={(imageUrls) => handleInputChange('images', imageUrls)}
                  maxImages={5}
                  className="mb-4"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToSearch}
                  disabled={isSubmitting}
                >
                  {t('reviews.cancel')}
                </Button>
                <Button 
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || reviewForm.rating === 0 || !reviewForm.title.trim() || !reviewForm.content.trim()}
                  className="bg-yp-blue hover:bg-yp-blue/90 text-white font-roboto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t('reviews.submitting')}
                    </>
                  ) : (
                    t('reviews.submitReview')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
      )}
      
      {/* Steps Section */}
      {currentStep === 'search' && (
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Store className="w-10 h-10 text-yp-blue" />
              </div>
              <h3 className="text-xl font-semibold text-yp-dark mb-3 font-comfortaa">
                Find the Business
              </h3>
              <p className="text-gray-600 font-roboto">
                Look for businesses by name and location.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-yp-blue" />
              </div>
              <h3 className="text-xl font-semibold text-yp-dark mb-3 font-comfortaa">
                Rate and Review
              </h3>
              <p className="text-gray-600 font-roboto">
                Businesses need your feedback, both good and bad, so they can improve or get props for a job well done.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-yp-blue" />
              </div>
              <h3 className="text-xl font-semibold text-yp-dark mb-3 font-comfortaa">
                Post It
              </h3>
              <p className="text-gray-600 font-roboto">
                Share your experiences and feel good knowing that you are making a difference in your community!
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
      
      <Footer />
    </div>
  );
};