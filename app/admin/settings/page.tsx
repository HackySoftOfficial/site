"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const settingsFormSchema = z.object({
  siteName: z.string().min(2, "Site name must be at least 2 characters"),
  supportEmail: z.string().email("Invalid email address"),
  enableNotifications: z.boolean(),
  apiKey: z.string().min(1, "API key is required"),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteName: "",
      supportEmail: "",
      enableNotifications: false,
      apiKey: "",
    },
  });

  // Load existing settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "general"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          form.reset({
            siteName: data.siteName,
            supportEmail: data.supportEmail,
            enableNotifications: data.enableNotifications,
            apiKey: data.apiKey,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings. Please refresh the page.",
          variant: "destructive",
        });
      }
    }

    loadSettings();
  }, [form, toast]);

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    try {
      // Save to Firestore
      await setDoc(doc(db, "settings", "general"), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure your application&apos;s general settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your website&apos;s name that will be displayed to users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormDescription>
                        Email address for customer support inquiries.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive email notifications for new orders and customer inquiries.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Your API key for external service integrations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}