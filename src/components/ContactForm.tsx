"use client";

import { contactSchema, type ContactFormData } from "@/lib/validation/contact";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserPlus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ContactForm({
  initialData,
  contactId,
}: {
  initialData?: any;
  contactId?: string;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fname: initialData?.fname ?? "",
      lname: initialData?.lname ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      relationship: initialData?.relationship ?? "",
      dob: initialData?.dob ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  // Sync form if initialData arrives after mount
  useEffect(() => {
    if (initialData) {
      form.reset({
        fname: initialData.fname ?? "",
        lname: initialData.lname ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        relationship: initialData.relationship ?? "",
        dob: initialData.dob ?? "",
        notes: initialData.notes ?? "",
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: ContactFormData) {
    if (!user) {
      alert("You must be logged in to save contacts.");
      return;
    }

    setSubmitting(true);

    try {
      const url = contactId ? `/api/contacts/${contactId}` : "/api/contacts";
      const method = contactId ? "PUT" : "POST";

      console.log(`[ContactForm] Submitting to ${url} with method ${method}`);

      const res = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("[ContactForm] Submit error:", err);
        throw new Error(err.error ?? (res.status === 401 ? "Unauthorized: Please login again" : "Failed to submit contact"));
      }

      console.log("[ContactForm] Successfully saved contact");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive text-lg">Access Denied</CardTitle>
          <CardDescription>
            You must be logged in to create or edit contacts.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/auth/login")} variant="outline">
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {contactId ? (
            <Save className="h-5 w-5 text-primary" />
          ) : (
            <UserPlus className="h-5 w-5 text-primary" />
          )}
          {contactId ? "Edit Contact" : "Create New Contact"}
        </CardTitle>
        <CardDescription>
          Fill in the details below to {contactId ? "update" : "add"} your contact in My Circle.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Relationship */}
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did you meet? Important facts..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="min-w-32">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : contactId ? (
                "Save Changes"
              ) : (
                "Create Contact"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
