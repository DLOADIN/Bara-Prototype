import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { PremiumFeatures } from "@/components/PremiumFeatures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  CheckCircle, 
  Star,
  Users,
  Shield,
  Clock,
  ArrowRight,
  FileText,
  User,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useListingClaims } from "@/hooks/useListingClaims";

interface ClaimForm {
  businessName: string;
  businessRegistrationNumber: string;
  businessAddress: string;
  contactName: string;
  registrantTitle: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  reasonForClaim: string;
  additionalInfo: string;
}

export const ClaimListingPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { createListingClaim, isLoading } = useListingClaims();
  
  const [formData, setFormData] = useState<ClaimForm>({
    businessName: '',
    businessRegistrationNumber: '',
    businessAddress: '',
    contactName: '',
    registrantTitle: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    reasonForClaim: '',
    additionalInfo: ''
  });

  const handleInputChange = (field: keyof ClaimForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.businessName.trim() || !formData.businessRegistrationNumber.trim() || !formData.contactName.trim() || !formData.contactEmail.trim()) {
      toast({
        title: t('claimListing.page.validation.title'),
        description: t('claimListing.page.validation.requiredFields'),
        variant: "destructive"
      });
      return;
    }

    const claimData = {
      business_name: formData.businessName,
      business_registration_number: formData.businessRegistrationNumber,
      business_address: formData.businessAddress,
      contact_name: formData.contactName,
      registrant_title: formData.registrantTitle || undefined,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhone || undefined,
      website: formData.website || undefined,
      reason_for_claim: formData.reasonForClaim,
      additional_info: formData.additionalInfo || undefined
    };
    
    const result = await createListingClaim(claimData);
    
    if (result) {
      toast({
        title: t('claimListing.page.success.title'),
        description: t('claimListing.page.success.description'),
        variant: "default"
      });
      
      // Reset form
      setFormData({
        businessName: '',
        businessRegistrationNumber: '',
        businessAddress: '',
        contactName: '',
        registrantTitle: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        reasonForClaim: '',
        additionalInfo: ''
      });
    } else {
      toast({
        title: t('claimListing.page.error.title'),
        description: t('claimListing.page.error.description'),
        variant: "destructive"
      });
    }
  };

  const benefits = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: t('claimListing.page.benefits.fullControl.title'),
      description: t('claimListing.page.benefits.fullControl.description')
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: t('claimListing.page.benefits.enhancedVisibility.title'),
      description: t('claimListing.page.benefits.enhancedVisibility.description')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('claimListing.page.benefits.customerReviews.title'),
      description: t('claimListing.page.benefits.customerReviews.description')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('claimListing.page.benefits.verifiedBadge.title'),
      description: t('claimListing.page.benefits.verifiedBadge.description')
    }
  ];

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-blue to-brand-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-comfortaa mb-6">
              {t('claimListing.page.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('claimListing.page.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{t('claimListing.page.hero.callUs')} (+250) 791 568 519 </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t('claimListing.page.hero.hours')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-yp-dark font-comfortaa mb-4">
              {t('claimListing.page.benefits.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('claimListing.page.benefits.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-yp-dark mb-2 font-comfortaa">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Features Section - Moved above the form */}
      <div className="border-t border-gray-100">
        <PremiumFeatures />
      </div>

      {/* Claim Form Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-yp-dark font-comfortaa mb-4">
              {t('claimListing.page.form.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('claimListing.page.form.subtitle')}
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <p className="text-center text-gray-600">
                {t('claimListing.page.form.requiredFields')}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.businessName')}
                    </label>
                    <Input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.businessName')}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Business Registration Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.businessRegistrationNumber')}
                    </label>
                    <Input
                      type="text"
                      value={formData.businessRegistrationNumber}
                      onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.businessRegistrationNumber')}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Business Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.businessAddress')}
                    </label>
                    <Input
                      type="text"
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.businessAddress')}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.contactName')}
                    </label>
                    <Input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.contactName')}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Registrant Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.registrantTitle')}
                    </label>
                    <Input
                      type="text"
                      value={formData.registrantTitle}
                      onChange={(e) => handleInputChange('registrantTitle', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.registrantTitle')}
                      className="w-full"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.contactEmail')}
                    </label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.contactEmail')}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.contactPhone')}
                    </label>
                    <Input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.contactPhone')}
                      className="w-full"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('claimListing.page.form.website')}
                    </label>
                    <Input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder={t('claimListing.page.form.placeholders.website')}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Reason for Claim */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('claimListing.page.form.reasonForClaim')}
                  </label>
                  <Textarea
                    value={formData.reasonForClaim}
                    onChange={(e) => handleInputChange('reasonForClaim', e.target.value)}
                    placeholder={t('claimListing.page.form.placeholders.reasonForClaim')}
                    className="w-full min-h-[100px]"
                    required
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('claimListing.page.form.additionalInfo')}
                  </label>
                  <Textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder={t('claimListing.page.form.placeholders.additionalInfo')}
                    className="w-full min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        {t('claimListing.page.form.submitting')}
                      </>
                    ) : (
                      <>
                        {t('claimListing.page.form.submit')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-comfortaa mb-6">
              {t('claimListing.page.contact.title')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('claimListing.page.contact.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('claimListing.page.contact.callUs.title')}</h3>
                <p className="text-lg">{t('claimListing.page.contact.callUs.phone')}</p>
                <p className="text-sm opacity-90">{t('claimListing.page.contact.callUs.hours')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('claimListing.page.contact.emailUs.title')}</h3>
                <p className="text-lg">{t('claimListing.page.contact.emailUs.email')}</p>
                <p className="text-sm opacity-90">{t('claimListing.page.contact.emailUs.response')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('claimListing.page.contact.processingTime.title')}</h3>
                <p className="text-lg">{t('claimListing.page.contact.processingTime.time')}</p>
                <p className="text-sm opacity-90">{t('claimListing.page.contact.processingTime.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-yp-dark font-comfortaa mb-4">
              {t('claimListing.page.faqSection.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('claimListing.page.faqSection.subtitle')}
            </p>
          </div>
          
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">How long does the verification process take?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  The verification process typically takes 2-3 business days. We'll notify you via email once your claim is approved or if we need additional information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">What information do I need to verify my business?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  You'll need to provide official business documentation such as a business license, tax ID, or utility bill. We may also require a government-issued ID to verify your identity as an authorized representative.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">Is there a cost to claim my business?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  No, claiming and verifying your business listing is completely free. This allows you to manage your business information, respond to reviews, and access basic analytics at no cost.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">What if my business isn't listed yet?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  If you can't find your business, you can add it by clicking the "Add a missing business" link at the bottom of the search results. You'll need to provide basic information about your business to create the listing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">Can I claim multiple locations of my business?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes, you can claim multiple locations. After claiming your first location, you'll have the option to add and manage additional locations from your business dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">What happens after my claim is approved?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Once approved, you'll gain access to your business dashboard where you can update business information, respond to reviews, add photos, view analytics, and access other exclusive features for business owners.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">Can I transfer ownership of my business listing?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes, you can transfer ownership by contacting our support team with the new owner's information. We'll guide both parties through the verification process to ensure a smooth transition.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">How do I update my business information?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  After claiming your business, you can update your information anytime through your business dashboard. Changes are typically reviewed and published within 24-48 hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">What if my claim is rejected?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  If your claim is rejected, we'll provide a reason and instructions on how to resolve the issue. Common reasons include insufficient documentation or incomplete information. You can reapply with the correct information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-medium text-left">How can I get help with the claiming process?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Our support team is available to assist you. You can contact us through the help center or email support@baralistings.com. Include your business name and any relevant details for faster assistance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
