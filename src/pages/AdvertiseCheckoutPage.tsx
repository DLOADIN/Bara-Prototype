import { useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Plan = 'basic' | 'standard' | 'premium';

const plans: Record<Plan, { name: string; price: number; features: string[] }> = {
  basic: { name: 'Basic', price: 19, features: ['Sidebar placement', 'Basic analytics'] },
  standard: { name: 'Standard', price: 49, features: ['Homepage rotation', 'Priority listing', 'Click analytics'] },
  premium: { name: 'Premium', price: 99, features: ['Hero banner rotation', 'Top category placement', 'Full analytics'] },
};

const AdvertiseCheckoutPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('standard');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');

  const handleCheckout = () => {
    // Placeholder client-only flow. Integrate backend (Stripe/Paystack) later.
    const plan = plans[selectedPlan];
    alert(`Proceeding to payment for ${plan.name} - $${plan.price}/mo\nBusiness: ${businessName}\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold font-comfortaa text-yp-dark mb-6">Advertise with BARA</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plans */}
          {(['basic','standard','premium'] as Plan[]).map((planKey) => {
            const plan = plans[planKey];
            const isActive = selectedPlan === planKey;
            return (
              <Card key={planKey} className={isActive ? 'border-yp-blue ring-1 ring-yp-blue' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.name}</span>
                    <span className="text-yp-blue">${plan.price}/mo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button onClick={() => setSelectedPlan(planKey)} className="mt-4 w-full bg-yp-blue text-white">
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Checkout form */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Business Name</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business" />
              </div>
              <div>
                <Label className="mb-1 block">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="md:col-span-2">
                <Label className="mb-1 block">Card Information</Label>
                <Input placeholder="Card number (Visa, Mastercard, etc.)" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input placeholder="MM / YY" />
                  <Input placeholder="CVC" />
                </div>
              </div>
            </div>
            <Button onClick={handleCheckout} className="mt-6 w-full bg-yellow-600 text-white">
              Pay ${plans[selectedPlan].price} / month
            </Button>
            <p className="text-xs text-gray-500 mt-2">Secure payments. We accept Visa, Mastercard and more. Backend processing will be integrated next.</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AdvertiseCheckoutPage;



