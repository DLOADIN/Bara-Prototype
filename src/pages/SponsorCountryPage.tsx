import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, 
  Globe, 
  Image as ImageIcon, 
  MapPin, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import { useSponsoredBanners } from '@/hooks/useSponsoredBanners';
import { db } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface Country {
  id: string;
  name: string;
  code: string;
  flag_url?: string;
}

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
  companyName: string;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  amount, 
  companyName 
}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would integrate with Stripe or another payment processor
    toast({
      title: "Payment Successful!",
      description: `Payment of $${amount} processed for ${companyName}`,
    });
    
    setIsProcessing(false);
    onPaymentSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Amount:</strong> ${amount} USD
            </p>
            <p className="text-sm text-blue-800">
              <strong>Company:</strong> {companyName}
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Card Number</label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">CVV</label>
                <Input
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Cardholder Name</label>
              <Input
                placeholder="John Doe"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Processing...' : `Pay $${amount}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const SponsorCountryPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { createBanner } = useSponsoredBanners();
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  
  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    banner_alt_text: '',
    country_id: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await db.countries()
        .select('id, name, code, flag_url')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: "Error",
        description: "Failed to load countries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload to a storage service
      const url = URL.createObjectURL(file);
      setBannerImage(file);
      setBannerImageUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bannerImage) {
      toast({
        title: "Image Required",
        description: "Please upload a banner image.",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async () => {
    setSubmitting(true);
    
    try {
      // In a real implementation, you would upload the image to storage first
      const bannerData = {
        ...formData,
        banner_image_url: bannerImageUrl, // This would be the uploaded image URL
        payment_status: 'paid' as const,
        payment_amount: 25.00,
        payment_reference: `PAY_${Date.now()}`,
      };

      const result = await createBanner(bannerData);
      
      if (result) {
        toast({
          title: "Success!",
          description: "Your sponsored banner has been submitted and will be reviewed by our team.",
        });
        
        // Reset form
        setFormData({
          company_name: '',
          company_website: '',
          banner_alt_text: '',
          country_id: '',
          contact_name: '',
          contact_email: '',
          contact_phone: '',
        });
        setBannerImage(null);
        setBannerImageUrl('');
        
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting banner:', error);
      toast({
        title: "Error",
        description: "Failed to submit banner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yp-gray-light">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yp-dark mb-4">
            Sponsor a Country Page
          </h1>
          <p className="text-lg text-yp-gray-dark max-w-2xl mx-auto">
            Get your company banner displayed on any country page for just $25. 
            Reach thousands of users interested in that specific country.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Country Page Banner</h4>
                    <p className="text-sm text-gray-600">Your banner displayed prominently on the chosen country page</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Company Visibility</h4>
                    <p className="text-sm text-gray-600">Increase brand awareness among country-specific users</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Targeted Audience</h4>
                    <p className="text-sm text-gray-600">Reach users specifically interested in that country</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">Price</span>
                    <span className="text-2xl font-bold text-blue-900">$25</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">One-time payment</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Banner Submission Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company Name *
                        </label>
                        <Input
                          required
                          value={formData.company_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                          placeholder="Your Company Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Website *
                        </label>
                        <Input
                          required
                          type="url"
                          value={formData.company_website}
                          onChange={(e) => setFormData(prev => ({ ...prev, company_website: e.target.value }))}
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banner Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Banner Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Country *
                      </label>
                      <Select
                        value={formData.country_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              <div className="flex items-center space-x-2">
                                {country.flag_url && (
                                  <img 
                                    src={country.flag_url} 
                                    alt={country.name}
                                    className="w-4 h-3"
                                  />
                                )}
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Banner Image *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {bannerImageUrl ? (
                          <div className="space-y-4">
                            <img 
                              src={bannerImageUrl} 
                              alt="Banner preview"
                              className="max-h-32 mx-auto rounded"
                            />
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setBannerImage(null);
                                  setBannerImageUrl('');
                                }}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Upload your banner image (Recommended: 1200x300px)
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="banner-upload"
                            />
                            <label
                              htmlFor="banner-upload"
                              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Choose Image
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Alt Text (Optional)
                      </label>
                      <Input
                        value={formData.banner_alt_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, banner_alt_text: e.target.value }))}
                        placeholder="Describe your banner for accessibility"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Contact Name *
                        </label>
                        <Input
                          required
                          value={formData.contact_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                          placeholder="Your Full Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <Input
                          required
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone (Optional)
                      </label>
                      <Input
                        value={formData.contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        By submitting this form, you agree to our terms and conditions. 
                        Your banner will be reviewed and approved within 24-48 hours.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-brand-blue hover:bg-brand-blue-dark"
                        disabled={submitting}
                      >
                        {submitting ? 'Processing...' : 'Pay $25 & Submit'}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={25}
        companyName={formData.company_name}
      />
      
      <Footer />
    </div>
  );
};
