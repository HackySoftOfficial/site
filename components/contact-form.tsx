"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import HCaptcha from '@hcaptcha/react-hcaptcha';

// Define the form schema type
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  hcaptchaToken: z.string().min(1, "Please complete the hCaptcha verification")
});

// Create a type from the schema
type ContactFormValues = z.infer<typeof formSchema>;

// Define the API response types
interface SuccessResponse {
  success: boolean;
}

interface ErrorResponse {
  error: string;
  remainingTime?: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export function ContactForm(): JSX.Element {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const captchaRef = useRef<HCaptcha>(null);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      hcaptchaToken: "",
    },
  });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const onSubmit = async (values: ContactFormValues): Promise<void> => {
    if (cooldown > 0) {
      toast({
        title: "Please wait",
        description: `You can submit again in ${cooldown} seconds`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json() as ApiResponse;

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Security verification failed. Please try again.');
        }
        throw new Error('error' in data ? data.error : 'Failed to send message');
      }

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
      setCooldown(30);
      captchaRef.current?.resetCaptcha();
      form.setValue('hcaptchaToken', '');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hcaptchaToken"
          render={() => (
            <FormItem>
              <FormControl>
                <HCaptcha
                  ref={captchaRef}
                  sitekey="2d4a6528-6638-4142-811c-f4ceff6af7e0"
                  onVerify={(token) => form.setValue('hcaptchaToken', token)}
                  theme="light"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || cooldown > 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : cooldown > 0 ? (
            `Wait ${cooldown}s`
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </Form>
  );
}