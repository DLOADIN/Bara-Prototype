import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Star, Zap, CheckCircle } from 'lucide-react';

type Plan = 'normal' | 'pro' | 'premium';

const features = [
  { nameKey: 'premiumFeatures.features.businessProfile', normal: true, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.basicContact', normal: true, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.socialLinks', normal: false, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.photoGallery', normal: false, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.businessHours', normal: false, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.productServices', normal: false, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.customerReviews', normal: true, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.prioritySupport', normal: false, pro: true, premium: true },
  { nameKey: 'premiumFeatures.features.analytics', normal: false, pro: false, premium: true },
  { nameKey: 'premiumFeatures.features.featuredListings', normal: false, pro: false, premium: true },
  { nameKey: 'premiumFeatures.features.unlimitedUploads', normal: false, pro: false, premium: true },
  { nameKey: 'premiumFeatures.features.customDomain', normal: false, pro: false, premium: true },
];

const plans = [
  {
    nameKey: 'premiumFeatures.plans.normal.name',
    priceKey: 'premiumFeatures.plans.normal.price',
    descriptionKey: 'premiumFeatures.plans.normal.description',
    buttonKey: 'premiumFeatures.plans.normal.button',
    popular: false,
    type: 'normal' as Plan,
  },
  {
    nameKey: 'premiumFeatures.plans.pro.name',
    priceKey: 'premiumFeatures.plans.pro.price',
    periodKey: 'premiumFeatures.common.perMonth',
    descriptionKey: 'premiumFeatures.plans.pro.description',
    buttonKey: 'premiumFeatures.plans.pro.button',
    popular: true,
    type: 'pro' as Plan,
  },
  {
    nameKey: 'premiumFeatures.plans.premium.name',
    priceKey: 'premiumFeatures.plans.premium.price',
    periodKey: 'premiumFeatures.common.perMonth',
    descriptionKey: 'premiumFeatures.plans.premium.description',
    buttonKey: 'premiumFeatures.plans.premium.button',
    popular: false,
    type: 'premium' as Plan,
  },
];

export const PremiumFeatures = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would process the payment
    console.log('Payment submitted for plan:', selectedPlan);
    setIsPaymentOpen(false);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            {t('premiumFeatures.hero.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('premiumFeatures.hero.subtitle')}
          </p>
          
          <div className="mt-8 flex justify-center items-center space-x-4">
            <span className={`font-medium ${!isYearly ? 'text-primary' : 'text-muted-foreground'}`}>
              {t('premiumFeatures.billing.monthly')}
            </span>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              role="switch"
              aria-checked={isYearly}
              onClick={() => setIsYearly(!isYearly)}
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                aria-hidden="true"
                className={`${isYearly ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
            <div className="relative">
              <span className="font-medium text-muted-foreground">
                {t('premiumFeatures.billing.yearly')}
              </span>
              <span className="absolute -right-4 -top-4 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                {t('premiumFeatures.billing.save')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <div key={plan.type} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {t('premiumFeatures.common.mostPopular')}
                  </div>
                </div>
              )}
              <Card className={`h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">{t(plan.nameKey)}</CardTitle>
                      <p className="text-muted-foreground mt-1">{t(plan.descriptionKey)}</p>
                    </div>
                    {plan.popular && <Star className="h-5 w-5 text-yellow-400" />}
                  </div>
                  <div className="mt-4">
                    <p className="text-4xl font-bold text-foreground">
                      {t(plan.priceKey)}
                      {(plan as any).periodKey && (
                        <span className="text-lg font-normal text-muted-foreground">
                          {isYearly ? t('premiumFeatures.common.perYear') : t((plan as any).periodKey)}
                        </span>
                      )}
                    </p>
                    {isYearly && plan.type !== 'normal' && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('premiumFeatures.pricing.billedAnnually', { amount: plan.type === 'pro' ? '50' : '200' })}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature.nameKey} className="flex items-start">
                        {feature[plan.type] ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-foreground">{t(feature.nameKey)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    onClick={() => handleSelectPlan(plan.type)}
                    className={`w-full py-6 text-base ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-foreground hover:bg-foreground/90'}`}
                  >
                    {t(plan.buttonKey)}
                    {plan.popular && <Zap className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('premiumFeatures.payment.title')}</DialogTitle>
            <DialogDescription>
              {selectedPlan === 'normal' 
                ? t('premiumFeatures.payment.freeDescription')
                : t('premiumFeatures.payment.planDescription', { plan: selectedPlan ? t(`premiumFeatures.planNames.${selectedPlan}`) : '' })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-foreground">
                  {selectedPlan ? t('premiumFeatures.payment.selectedPlan', { plan: t(`premiumFeatures.planNames.${selectedPlan}`) }) : ''}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan === 'normal' 
                    ? t('premiumFeatures.payment.freeForever') 
                    : isYearly 
                      ? t('premiumFeatures.payment.annualBilling', { amount: selectedPlan === 'pro' ? '50' : '200' })
                      : t('premiumFeatures.payment.monthlyBilling', { amount: selectedPlan === 'pro' ? '5' : '20' })}
                </p>
              </div>
              {selectedPlan !== 'normal' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsYearly(!isYearly)}
                  className="text-sm"
                >
                  {t('premiumFeatures.payment.switchBilling', { to: isYearly ? t('premiumFeatures.billing.monthly') : t('premiumFeatures.billing.yearly') })}
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('premiumFeatures.form.fullName')}</Label>
              <Input id="name" placeholder={t('premiumFeatures.form.fullNamePlaceholder')} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('premiumFeatures.form.email')}</Label>
              <Input id="email" type="email" placeholder={t('premiumFeatures.form.emailPlaceholder')} required />
            </div>

            {selectedPlan !== 'normal' && (
              <div className="space-y-2">
                <Label>{t('premiumFeatures.payment.method')}</Label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-6 bg-muted-foreground/10 rounded-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.5 0H2.5C1.125 0 0 1.125 0 2.5V13.5C0 14.875 1.125 16 2.5 16H21.5C22.875 16 24 14.875 24 13.5V2.5C24 1.125 22.875 0 21.5 0Z" fill="#0066CC"/>
                        <path d="M16 8C16 5.8 14.2 4 12 4C9.8 4 8 5.8 8 8C8 10.2 9.8 12 12 12C14.2 12 16 10.2 16 8Z" fill="white"/>
                        <path d="M12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10Z" fill="#0066CC"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{t('premiumFeatures.payment.card')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="card-number">{t('premiumFeatures.payment.cardNumber')}</Label>
                      <Input id="card-number" placeholder={t('premiumFeatures.payment.cardNumberPlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="expiry">{t('premiumFeatures.payment.expiry')}</Label>
                      <Input id="expiry" placeholder={t('premiumFeatures.payment.expiryPlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="cvc">{t('premiumFeatures.payment.cvc')}</Label>
                      <Input id="cvc" placeholder={t('premiumFeatures.payment.cvcPlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="zip">{t('premiumFeatures.payment.zip')}</Label>
                      <Input id="zip" placeholder={t('premiumFeatures.payment.zipPlaceholder')} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>{t('premiumFeatures.notice.label')} </strong>{t('premiumFeatures.notice.text')}
              </p>
            </div>

            <div className="mt-6">
              <Button type="submit" className="w-full py-6 text-base">
                {selectedPlan === 'normal' ? t('premiumFeatures.actions.completeFree') : t('premiumFeatures.actions.confirmPayment')}
              </Button>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {t('premiumFeatures.legal.agree')}
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumFeatures;
