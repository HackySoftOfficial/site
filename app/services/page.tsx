import ServiceWizard from '@/components/service-wizard';

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
      <ServiceWizard />
    </main>
  );
}