import { Card } from '@/components/ui/card';
import { Code2, Rocket, Zap } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Why Choose DevForge?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <Rocket className="h-12 w-12 mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold mb-2">Rapid Development</h3>
            <p className="text-muted-foreground">
              From concept to production in record time with our expert team.
            </p>
          </Card>
          <Card className="p-6">
            <Code2 className="h-12 w-12 mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold mb-2">Clean Code</h3>
            <p className="text-muted-foreground">
              Maintainable, scalable, and well-documented code that grows with your business.
            </p>
          </Card>
          <Card className="p-6">
            <Zap className="h-12 w-12 mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold mb-2">Performance First</h3>
            <p className="text-muted-foreground">
              Optimized applications that deliver lightning-fast experiences.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}