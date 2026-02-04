"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, UserPlus } from "lucide-react";

// Schema correcto desde main
import { contactCreateSchema } from "@/lib/validation/contact.schema";

// UI
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

type ContactFormData = z.infer<typeof contactCreateSchema>;

export default function ContactForm({
  initialData,
  contactId,
}: {
  initialData?: any;
  contactId?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactCreateSchema),
    defaultValues: {
      fname: initialData?.fname ?? "",
      lname: initialData?.lname ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      relationship: initialData?.relationship ?? undefined,
      dob: initialData?.dob ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        fname: initialData.fname ?? "",
        lname: initialData.lname ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        relationship: initialData.relationship ?? undefined,
        dob: initialData.dob ?? "",
        notes: initialData.notes ?? "",
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: ContactFormData) {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        relationship: data.relationship || null,
        dob: data.dob || null,
        notes: data.notes || null,
      };

      const url = contactId ? `/api/contacts/${contactId}` : "/api/contacts";
      const method = contactId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? "Failed to save contact");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? "Unexpected error");
    } finally {
      setSubmitting(false);
    }
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
          {contactId ? "Edit Contact" : "Create Contact"}
        </CardTitle>
        <CardDescription>
          {contactId
            ? "Update the contact information."
            : "Add a new contact to your circle."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input {...form.register("fname")} />
            </div>

            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input {...form.register("lname")} />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...form.register("email")} />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input {...form.register("phone")} />
            </div>

            <div>
              <label className="text-sm font-medium">Relationship</label>
              <Select
                onValueChange={(v) =>
                  form.setValue("relationship", v as any)
                }
                defaultValue={
                  form.getValues("relationship") ?? undefined
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="acquaintance">Acquaintance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" {...form.register("dob")} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea {...form.register("notes")} />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
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
