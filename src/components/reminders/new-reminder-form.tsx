"use client";

import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { reminderTypeEnum } from "@/lib/validation/reminder.schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/ui/formField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

type Contact = {
  id: string;
  fname: string | null;
  lname: string | null;
  email?: string | null;
};

// ✅ Schema SOLO para "Create" (sin status)
const reminderCreateSchemaForForm = z.object({
  contact_id: z.string().min(1, "Select a contact"),
  message: z.string().min(1, "Message is required"),
  reminder_type: reminderTypeEnum,
  reminder_date: z.date().nullable(),
});

export type NewReminderFormData = z.infer<typeof reminderCreateSchemaForForm>;

const reminderTypes = ["birthday", "follow_up", "custom", "anniversary"] as const;

export default function NewReminderForm({
  redirectTo = "/reminders",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  const form = useForm<NewReminderFormData>({
    resolver: zodResolver(reminderCreateSchemaForForm),
    mode: "onChange",
    defaultValues: {
      contact_id: "",
      message: "",
      reminder_type: "custom",
      reminder_date: null,
    },
  });

  const contactOptions = useMemo(() => {
    return (contacts ?? []).map((c) => ({
      id: c.id,
      label:
        `${c.fname ?? ""} ${c.lname ?? ""}`.trim() ||
        c.email ||
        "Unnamed Contact",
    }));
  }, [contacts]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setContactsError(null);
        setLoadingContacts(true);

        const res = await fetch(`/api/contacts?limit=100&offset=0`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Failed to load contacts (${res.status}): ${txt}`);
        }

        const data = await res.json();
        const list: Contact[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.contacts)
            ? data.contacts
            : Array.isArray(data)
              ? data
              : [];

        if (!cancelled) setContacts(list);
      } catch (e: any) {
        if (!cancelled) {
          setContacts([]);
          setContactsError(e?.message ?? "Failed to load contacts");
        }
      } finally {
        if (!cancelled) setLoadingContacts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit: SubmitHandler<NewReminderFormData> = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        reminder_date: data.reminder_date ? data.reminder_date.toISOString() : null,
      };

      const res = await fetch("/api/reminders", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any)?.error ?? "Failed to create reminder");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Contact */}
          <FormField
            id="contact_id"
            label="Contact"
            error={form.formState.errors.contact_id}
          >
            <Controller
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <Select
                  value={field.value || "_"}
                  onValueChange={(v) => field.onChange(v === "_" ? "" : v)}
                  disabled={loadingContacts || !!contactsError}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingContacts
                          ? "Loading contacts..."
                          : contactsError
                            ? "Could not load contacts"
                            : "Select a contact"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_">Select a contact</SelectItem>
                    {contactOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {contactsError && (
              <p className="mt-2 text-sm text-rose-600">{contactsError}</p>
            )}
          </FormField>

          {/* Message + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="message"
              label="Message"
              error={form.formState.errors.message}
            >
              <Input
                {...form.register("message")}
                placeholder="Enter reminder message"
              />
            </FormField>

            <FormField
              id="reminder_type"
              label="Reminder Type"
              error={form.formState.errors.reminder_type}
            >
              <Controller
                control={form.control}
                name="reminder_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .replace("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </div>

        {/* RIGHT COLUMN — Calendar */}
        <div className="space-y-2 self-start lg:pl-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-900">
              Reminder Date
            </p>
          </div>

          <FormField
            id="reminder_date"
            label=""
            error={form.formState.errors.reminder_date}
          >
            <Controller
              control={form.control}
              name="reminder_date"
              render={({ field }) => (
                <div className="flex justify-center lg:justify-start">
                  <div className="rounded-2xl bg-white/85 ring-1 ring-black/10 p-2 shadow-sm w-full max-w-[320px] sm:max-w-none w-auto overflow-hidden sm:overflow-visible scale-90 sm:scale-100 origin-top">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(d) => field.onChange(d ?? null)}
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}
            />
          </FormField>

          <p className="text-xs text-neutral-600">
            Pick a date for the reminder.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-neutral-200">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={submitting}
          className="w-full sm:w-auto font-medium"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={submitting || !form.formState.isValid}
          className="w-full sm:w-auto min-w-32 font-bold"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Reminder"
          )}
        </Button>
      </div>
    </form>
  );
}
