import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <Analytics />
      <SpeedInsights />
      <FeaturesSection />
    </main>
  );
}