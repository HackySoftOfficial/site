"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadStripe } from '@stripe/stripe-js';
import { Download } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SOFTWARE_PRODUCTS = [
  {
    id: 'webhook-spammer',
    name: 'Webhook Spammer',
    description: 'Professional webhook testing and automation tool for Discord',
    price: 29.99,
    repo: 'webhook-spammer'
  },
  {
    id: 'discord-token-gen',
    name: 'Discord Token Generator',
    description: 'Advanced token generation utility with proxy support',
    price: 49.99,
    repo: 'discord-token-gen-old'
  },
  {
    id: 'pycompiler',
    name: 'PyCompiler',
    description: 'Powerful Python code compilation and obfuscation tool',
    price: 39.99,
    repo: 'PyCompiler'
  },
  {
    id: 'scam-bot',
    name: 'Security Testing Bot',
    description: 'Educational security testing tool for Discord',
    price: 34.99,
    repo: 'scam-bot'
  },
  {
    id: 'dead-lavaraider',
    name: 'DEAD-LavaRaider',
    description: 'Advanced Discord server management utility',
    price: 44.99,
    repo: 'DEAD-LavaRaider'
  },
  {
    id: 'lazysafe',
    name: 'LazySafe',
    description: 'Automated security testing framework',
    price: 39.99,
    repo: 'LazySafe'
  }
];

const CUSTOM_SERVICE_TYPES = {
  web: { base: 5000, title: 'Web Development' },
  mobile: { base: 8000, title: 'Mobile Development' },
  desktop: { base: 7000, title: 'Desktop Development' },
  api: { base: 4000, title: 'API Development' },
};

type ServiceType = keyof typeof CUSTOM_SERVICE_TYPES;
type ProjectSize = 'small' | 'medium' | 'large';

export function ServiceWizard() {
  const [activeTab, setActiveTab] = useState('products');
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('web');
  const [projectSize, setProjectSize] = useState<ProjectSize>('small');
  const [teamSize, setTeamSize] = useState(1);
  const [duration, setDuration] = useState(1);
  const [downloadStates, setDownloadStates] = useState<Record<string, boolean>>({});

  const handleSoftwarePurchase = async (product: typeof SOFTWARE_PRODUCTS[0]) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          price: product.price,
          type: 'software',
          repo: product.repo
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownload = async (product: typeof SOFTWARE_PRODUCTS[0], sessionId: string) => {
    try {
      setDownloadStates(prev => ({ ...prev, [product.id]: true }));
      
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoName: product.repo,
          sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.repo}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloadStates(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const calculateCustomPrice = () => {
    const basePrice = CUSTOM_SERVICE_TYPES[serviceType].base;
    const sizeMultiplier = {
      small: 1,
      medium: 1.5,
      large: 2,
    }[projectSize];

    return basePrice * sizeMultiplier * teamSize * duration;
  };

  const handleCustomCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType,
          projectSize,
          teamSize,
          duration,
          price: calculateCustomPrice(),
          type: 'custom',
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="products">Software Products</TabsTrigger>
          <TabsTrigger value="custom">Custom Development</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SOFTWARE_PRODUCTS.map((product) => (
              <Card key={product.id} className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <Button 
                    onClick={() => handleSoftwarePurchase(product)}
                    disabled={downloadStates[product.id]}
                  >
                    {downloadStates[product.id] ? (
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
          <Card className="p-6">
            <div className="space-y-8">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">What type of service do you need?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(CUSTOM_SERVICE_TYPES).map(([type, { title }]) => (
                      <Button
                        key={type}
                        variant={serviceType === type ? "default" : "outline"}
                        className="h-24"
                        onClick={() => setServiceType(type as ServiceType)}
                      >
                        {title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Project Size</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['small', 'medium', 'large'].map((size) => (
                      <Button
                        key={size}
                        variant={projectSize === size ? "default" : "outline"}
                        className="h-24"
                        onClick={() => setProjectSize(size as ProjectSize)}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                        <br />
                        {size === 'small' ? '1-3 months' : size === 'medium' ? '3-6 months' : '6+ months'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Team Size</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((size) => (
                      <Button
                        key={size}
                        variant={teamSize === size ? "default" : "outline"}
                        onClick={() => setTeamSize(size)}
                      >
                        {size} Dev{size > 1 ? 's' : ''}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Project Duration</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 3, 6, 12].map((months) => (
                      <Button
                        key={months}
                        variant={duration === months ? "default" : "outline"}
                        onClick={() => setDuration(months)}
                      >
                        {months} Month{months > 1 ? 's' : ''}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Project Summary</h2>
                  <div className="space-y-4">
                    <p>Service Type: {CUSTOM_SERVICE_TYPES[serviceType].title}</p>
                    <p>Project Size: {projectSize.charAt(0).toUpperCase() + projectSize.slice(1)}</p>
                    <p>Team Size: {teamSize} developer{teamSize > 1 ? 's' : ''}</p>
                    <p>Duration: {duration} month{duration > 1 ? 's' : ''}</p>
                    <p className="text-2xl font-bold">
                      Estimated Price: ${calculateCustomPrice().toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (step === 5) {
                      handleCustomCheckout();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                >
                  {step === 5 ? 'Proceed to Payment' : 'Next'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}