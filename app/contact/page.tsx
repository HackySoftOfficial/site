import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-24">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Get in Touch</h1>
        <p className="text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}