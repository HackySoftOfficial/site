import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="container mx-auto px-4 py-32">
      <Card className="max-w-md mx-auto p-6 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for choosing our services. We'll be in touch shortly to begin your project.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </Card>
    </main>
  );
}