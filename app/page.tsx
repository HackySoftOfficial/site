import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}