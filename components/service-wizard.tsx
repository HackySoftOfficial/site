"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const QRCode = dynamic(
  () => import('qrcode.react').then((mod) => {
    const { QRCodeSVG } = mod;
    return QRCodeSVG;
  }),
  { ssr: false }
);

const PRODUCT_TIERS = {
  starter: {
    name: 'Starter Tools',
    description: 'Essential automation tools and utilities',
    basePrice: 5.99,
    maxPrice: 9.99,
    examples: ['Task Automators', 'File Converters', 'System Monitors']
  },
  professional: {
    name: 'Professional Suite',
    description: 'Advanced tools with data processing capabilities',
    basePrice: 12.99,
    maxPrice: 19.99,
    examples: ['Network Analyzers', 'Data Scrapers', 'Automation Frameworks']
  },
  enterprise: {
    name: 'Enterprise Solutions',
    description: 'Full-scale applications with advanced features',
    basePrice: 24.99,
    maxPrice: 49.99,
    examples: ['Custom Automation Suites', 'Integration Tools', 'Enterprise Frameworks']
  }
};

interface CheckoutResponse {
  sessionId: string;
}

interface CryptoPaymentDialogProps {
  amount: number;
  onClose: () => void;
  productId: string;
}

interface CryptoOrderResponse {
  checkoutUrl: string;
  orderId: string;
}

function CryptoPaymentDialog({ amount, onClose, productId }: CryptoPaymentDialogProps) {
  const [contactMethod, setContactMethod] = useState<'discord' | 'phone' | 'signal' | 'email'>('discord');
  const [contactValue, setContactValue] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createCoinbaseCharge = async () => {
      try {
        const response = await fetch('/api/create-crypto-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            amount,
            contactMethod,
            contactValue
          })
        });

        const data = await response.json() as CryptoOrderResponse;
        setCheckoutUrl(data.checkoutUrl);
      } catch (error) {
        console.error('Error creating Coinbase charge:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (contactValue) {
      createCoinbaseCharge();
    }
  }, [amount, productId, contactMethod, contactValue]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cryptocurrency Payment</DialogTitle>
          <DialogDescription>
            Pay ${amount.toFixed(2)} using your preferred cryptocurrency
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>How should we contact you?</Label>
            <RadioGroup
              value={contactMethod}
              onValueChange={(value) => setContactMethod(value as typeof contactMethod)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="discord" id="discord" />
                <Label htmlFor="discord">Discord</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone">Phone (EU)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="signal" id="signal" />
                <Label htmlFor="signal">Signal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
            </RadioGroup>

            <Input
              placeholder={
                contactMethod === 'discord' ? 'Username#0000' :
                contactMethod === 'phone' ? '+44 123456789' :
                contactMethod === 'signal' ? '+1234567890' :
                'email@example.com'
              }
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : checkoutUrl ? (
            <div className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => window.open(checkoutUrl, '_blank')}
              >
                Proceed to Coinbase Checkout
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                You will be redirected to Coinbase Commerce to complete your payment
              </p>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setContactValue(contactValue)}
              disabled={!contactValue}
            >
              Continue to Payment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceWizard() {
  const [selectedTier, setSelectedTier] = useState<keyof typeof PRODUCT_TIERS>('starter');
  const [complexity, setComplexity] = useState(0);
  const [price, setPrice] = useState(PRODUCT_TIERS.starter.basePrice);
  const [downloadStates, setDownloadStates] = useState<Record<string, boolean>>({});
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{amount: number, productId: string} | null>(null);

  const calculatePrice = (tier: keyof typeof PRODUCT_TIERS, complexityLevel: number) => {
    const { basePrice, maxPrice } = PRODUCT_TIERS[tier];
    const range = maxPrice - basePrice;
    return basePrice + (range * (complexityLevel / 100));
  };

  const handleComplexityChange = (value: number[]) => {
    setComplexity(value[0]);
    setPrice(calculatePrice(selectedTier, value[0]));
  };

  const handleSoftwarePurchase = async (product: typeof PRODUCT_TIERS[keyof typeof PRODUCT_TIERS]) => {
    setPaymentDetails({
      amount: product.basePrice,
      productId: product.name
    });
    setShowPayment(true);
  };

  const handlePurchase = async (tier: keyof typeof PRODUCT_TIERS, finalPrice: number) => {
    setPaymentDetails({
      amount: finalPrice,
      productId: `custom-${tier}`
    });
    setShowPayment(true);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="products">Ready-Made Tools</TabsTrigger>
            <TabsTrigger value="custom">Build Your Tool</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(PRODUCT_TIERS).map((category) => (
                <Card key={category.name} className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${category.basePrice} - ${category.maxPrice}</span>
                    <Button 
                      onClick={() => handleSoftwarePurchase(category)}
                      disabled={downloadStates[category.name]}
                    >
                      {downloadStates[category.name] ? (
                        <>
                          <Download className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        'Purchase'
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Build Your Custom Tool</CardTitle>
                <CardDescription>
                  Adjust the complexity level to match your needs. All tools include a 30-day warranty.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {Object.entries(PRODUCT_TIERS).map(([key, tier]) => (
                    <div 
                      key={key}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedTier === key ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedTier(key as keyof typeof PRODUCT_TIERS);
                        setPrice(calculatePrice(key as keyof typeof PRODUCT_TIERS, complexity));
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{tier.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          ${tier.basePrice} - ${tier.maxPrice}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Complexity Level: {complexity}%
                  </label>
                  <Slider
                    value={[complexity]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={handleComplexityChange}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Basic</span>
                    <span>Complex</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">${price.toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">Final Price</p>
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Included in your custom tool:</p>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {PRODUCT_TIERS[selectedTier].examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button className="w-full" onClick={() => handlePurchase(selectedTier, price)}>
                  Start Building
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showPayment && paymentDetails && (
        <CryptoPaymentDialog
          amount={paymentDetails.amount}
          productId={paymentDetails.productId}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}