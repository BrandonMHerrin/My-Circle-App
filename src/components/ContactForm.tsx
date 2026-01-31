"use client";

import { contactSchema } from "@/lib/validation/contact";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserPlus, Save } from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function ContactForm({
  initialData,
  contactId,
}: {
  initialData?: any;
  contactId?: string;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    fname: initialData?.fname ?? "",
    lname: initialData?.lname ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    relationship: initialData?.relationship ?? "",
    dob: initialData?.dob ?? "",
    notes: initialData?.notes ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  // Sync state if initialData arrives after mount (though usually handles via server component)
  useEffect(() => {
    if (initialData) {
      setForm({
        fname: initialData.fname ?? "",
        lname: initialData.lname ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        relationship: initialData.relationship ?? "",
        dob: initialData.dob ?? "",
        notes: initialData.notes ?? "",
      });
    }
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(value: string) {
    setForm((prev) => ({ ...prev, relationship: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to save contacts.");
      return;
    }

    setErrors({});
    setSubmitting(true);

    // Validate form
    const parsed = contactSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      setSubmitting(false);
      return;
    }

    try {
      const url = contactId ? `/api/contacts/${contactId}` : "/api/contacts";
      const method = contactId ? "PUT" : "POST";

      console.log(`[ContactForm] Submitting to ${url} with method ${method}`);

      const res = await fetch(url, {
        method,
        body: JSON.stringify(parsed.data),
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

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="fname" className={errors.fname ? "text-destructive" : ""}>
                First Name
              </Label>
              <Input
                id="fname"
                name="fname"
                value={form.fname}
                onChange={handleChange}
                placeholder="John"
                aria-invalid={!!errors.fname}
              />
              {errors.fname && (
                <p className="text-xs font-medium text-destructive">{errors.fname[0]}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lname" className={errors.lname ? "text-destructive" : ""}>
                Last Name
              </Label>
              <Input
                id="lname"
                name="lname"
                value={form.lname}
                onChange={handleChange}
                placeholder="Doe"
                aria-invalid={!!errors.lname}
              />
              {errors.lname && (
                <p className="text-xs font-medium text-destructive">{errors.lname[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">{errors.email[0]}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="text-xs font-medium text-destructive">{errors.phone[0]}</p>
              )}
            </div>

            {/* Relationship */}
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="relationship" className={errors.relationship ? "text-destructive" : ""}>
                Relationship
              </Label>
              <Select value={form.relationship} onValueChange={handleSelectChange}>
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.relationship && (
                <p className="text-xs font-medium text-destructive">
                  {errors.relationship[0]}
                </p>
              )}
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
              />
              {errors.dob && (
                <p className="text-xs font-medium text-destructive">{errors.dob[0]}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Personal Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="How did you meet? Important facts..."
              className="resize-none"
            />
            {errors.notes && (
              <p className="text-xs font-medium text-destructive">{errors.notes[0]}</p>
            )}
          </div>
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
    </Card>
  );
}
