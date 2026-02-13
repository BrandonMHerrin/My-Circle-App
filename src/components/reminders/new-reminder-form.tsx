"use client";

import { z } from "zod";  
import { reminderCreateSchemaForForm, reminderTypeEnum } from "@/lib/validation/reminder.schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FormField } from "../ui/formField";
import { Calendar } from "@/components/ui/calendar";

export type ReminderFormInput = z.input<typeof reminderCreateSchemaForForm>;

type Contact = {
  id: string;
  fname: string | null;
  lname: string | null;
  email?: string | null;
};

const reminderTypes = ["birthday", "follow_up", "custom", "anniversary"] as const;

export default function NewReminderForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);

  // Form setup
  const form = useForm<ReminderFormInput>({
    resolver: zodResolver(reminderCreateSchemaForForm),
    mode: "onChange",
    defaultValues: {
      contact_id: "",
      message: "",
      reminder_date: null,
      reminder_type: "custom",
    },
  });

  // Fetch contacts
  useEffect(() => {
    let cancelled = false;

    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        setContactsError(null);

        const res = await fetch("/api/contacts?limit=100&offset=0", { credentials: "include" });
        if (!res.ok) throw new Error(await res.text() || "Failed to load contacts");

        const data = await res.json();
        const list: Contact[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

        if (!cancelled) setContacts(list);
      } catch (err: any) {
        if (!cancelled) setContactsError(err.message ?? "Failed to load contacts");
      } finally {
        if (!cancelled) setLoadingContacts(false);
      }
    };

    fetchContacts();
    return () => { cancelled = true; };
  }, []);

  // Form submit
  const onSubmit: SubmitHandler<ReminderFormInput> = async (data) => {
    setSubmitting(true);

    try {
      const payload = {
        ...data,
        reminder_date: data.reminder_date?.toISOString() ?? null,
      };

      const res = await fetch("/api/reminders", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to submit reminder");
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      form.setError("root", { message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5 text-primary" /> Create New Reminder
        </CardTitle>
        <CardDescription>
          Fill in the details below to add your reminder in My Circle.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}

            {/* Contact Select */}
            <FormField id="contact_id" label="Contact" error={form.formState.errors.contact_id}>
              <Controller
                control={form.control}
                name="contact_id"
                render={({ field }) => (
                  <Select
                    value={field.value || "_"}
                    onValueChange={(value) => field.onChange(value === "_" ? "" : value)}
                    disabled={loadingContacts || !!contactsError}
                  >
                    <SelectTrigger id="contact_id" className="w-full">
                      <SelectValue
                        placeholder={
                          loadingContacts
                            ? "Loading contacts..."
                            : contactsError
                            ? "Failed to load contacts"
                            : "Select a contact"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {!loadingContacts && contacts.length === 0 && (
                        <SelectItem value="_" disabled>No contacts found</SelectItem>
                      )}
                      <SelectItem value="_" disabled>Select a contact</SelectItem>
                      {contacts.map((c) => {
                        const label = `${c.fname ?? ""} ${c.lname ?? ""}`.trim() || c.email || "Unnamed Contact";
                        return <SelectItem key={c.id} value={c.id}>{label}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {contactsError && <p className="mt-2 text-sm text-red-500">{contactsError}</p>}
            </FormField>

            {/* Message Input */}
            <FormField id="message" label="Message" error={form.formState.errors.message}>
              <Input {...form.register("message")} placeholder="Enter reminder message" />
            </FormField>

            {/* Reminder Type Select */}
            <FormField id="reminder_type" label="Reminder Type" error={form.formState.errors.reminder_type}>
              <Controller
                control={form.control}
                name="reminder_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="reminder_type" className="w-full">
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {/* Reminder Date Calendar */}
            <FormField id="reminder_date" label="Reminder Date" error={form.formState.errors.reminder_date}>
              <Controller
                control={form.control}
                name="reminder_date"
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={(date: Date | undefined) => field.onChange(date)}
                  />
                )}
              />
            </FormField>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t mt-4 p-6 bg-muted/40">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" disabled={submitting || !form.formState.isValid} className="min-w-32">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Create Reminder"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
