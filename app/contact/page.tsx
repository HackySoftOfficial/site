import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-2xl">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold">Get in Touch</h1>
          <p className="text-muted-foreground">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}