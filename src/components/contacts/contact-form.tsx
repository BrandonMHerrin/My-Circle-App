"use client";

import { z } from "zod";
import { contactCreateSchema } from "@/lib/validation/contact.schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "../ui/formField";

// ✅ Sticker UI
import { StickerCard } from "@/components/notebook/sticker-card";

export type ContactFormData = z.infer<typeof contactCreateSchema>;

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
      email: initialData?.email ?? null,
      phone: initialData?.phone ?? null,
      relationship: initialData?.relationship ?? null,
      dob: initialData?.dob ?? null,
      notes: initialData?.notes ?? null,
    },
  });

  // Sync form if initialData arrives after mount
  useEffect(() => {
    if (initialData) {
      form.reset({
        fname: initialData.fname ?? "",
        lname: initialData.lname ?? "",
        email: initialData.email ?? null,
        phone: initialData.phone ?? null,
        relationship: initialData.relationship ?? null,
        dob: initialData.dob ?? null,
        notes: initialData.notes ?? null,
      });
    }
  }, [initialData, form]);

  async function handleDelete() {
    setSubmitting(true);
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirmed) {
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to delete contact");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(data: ContactFormData) {
    setSubmitting(true);

    try {
      const url = contactId ? `/api/contacts/${contactId}` : "/api/contacts";
      const method = contactId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[ContactForm] Submit error:", err);
        throw new Error(
          err.error ??
            (res.status === 401
              ? "Unauthorized: Please login again"
              : "Failed to submit contact")
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StickerCard tone="lemon" tiltIndex={1} className="p-6">
      {/* panel blanco interior */}
      <div className="rounded-2xl bg-white/80 ring-1 ring-black/10 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                id="fname"
                label="First Name"
                error={form.formState.errors.fname}
              >
                <Input
                  id="fname"
                  {...form.register("fname")}
                  placeholder="John"
                />
              </FormField>

              {/* Last Name */}
              <FormField
                id="lname"
                label="Last Name"
                error={form.formState.errors.lname}
              >
                <Input
                  id="lname"
                  {...form.register("lname")}
                  placeholder="Doe"
                />
              </FormField>

              {/* Email */}
              <FormField
                id="email"
                label="Email"
                error={form.formState.errors.email}
              >
                <Input
                  id="email"
                  {...form.register("email")}
                  placeholder="john@mail.com"
                />
              </FormField>

              {/* Phone */}
              <FormField
                id="phone"
                label="Phone Number"
                error={form.formState.errors.phone}
              >
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="+1 (555) 000-0000"
                />
              </FormField>

              {/* Relationship */}
              <FormField
                id="relationship"
                label="Relationship"
                error={form.formState.errors.relationship}
              >
                <Select
                  value={form.watch("relationship") ?? "_"}
                  onValueChange={(value) =>
                    form.setValue(
                      "relationship",
                      value === "_"
                        ? null
                        : (value as ContactFormData["relationship"])
                    )
                  }
                >
                  <SelectTrigger id="relationship" className="w-full">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_">Select relationship</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="acquaintance">Acquaintance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              {/* DOB */}
              <FormField id="dob" label="Birthday" error={form.formState.errors.dob}>
                <Input
                  id="dob"
                  {...form.register("dob")}
                  placeholder="1990-01-01"
                />
              </FormField>
            </div>

            {/* Notes */}
            <FormField
              id="notes"
              label="Personal Notes"
              error={form.formState.errors.notes}
            >
              <Textarea
                id="notes"
                placeholder="How did you meet? Important facts..."
                className="resize-none"
                {...form.register("notes")}
              />
            </FormField>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between border-t px-6 py-5 bg-white/70">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={submitting}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {contactId && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={submitting}
                  className="rounded-xl"
                  onClick={handleDelete}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Contact"
                  )}
                </Button>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#2D2A7A] text-white hover:bg-[#231f63]"
              >
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
            </div>
          </CardFooter>
        </form>
      </div>
    </StickerCard>
  );
}
