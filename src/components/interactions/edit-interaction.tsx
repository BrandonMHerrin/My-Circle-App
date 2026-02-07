"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  interactionCreateSchema,
  type InteractionCreateInput,
} from "@/lib/validation/interaction.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/formField";
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

type Contact = {
  id: string;
  fname: string | null;
  lname: string | null;
  email?: string | null;
};

type Interaction = {
  id: string;
  contact_id: string;
  interaction_date: string;
  type: "call" | "meeting" | "email" | "text" | "other";
  notes: string | null;
  location: string | null;
  duration_minutes: number | null;
};

export default function EditInteraction({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsError, setContactsError] = useState<string | null>(null);

  const form = useForm<InteractionCreateInput>({
    resolver: zodResolver(interactionCreateSchema),
    defaultValues: {
      contact_id: "",
      interaction_date: new Date().toISOString().slice(0, 10),
      type: "call",
      notes: "",
      location: null,
      duration_minutes: null,
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
        setLoading(true);

        const [iRes, cRes] = await Promise.all([
          fetch(`/api/interactions/${id}`, { credentials: "include" }),
          fetch(`/api/contacts?limit=100&offset=0`, { credentials: "include" }),
        ]);

        if (!iRes.ok) {
          const t = await iRes.text().catch(() => "");
          throw new Error(`Failed to load interaction (${iRes.status}): ${t}`);
        }
        const iJson = await iRes.json();
        const interaction: Interaction = iJson?.interaction;

        if (!cRes.ok) {
          const t = await cRes.text().catch(() => "");
          throw new Error(`Failed to load contacts (${cRes.status}): ${t}`);
        }
        const cJson = await cRes.json();
        const list: Contact[] = Array.isArray(cJson?.data)
          ? cJson.data
          : Array.isArray(cJson?.contacts)
          ? cJson.contacts
          : Array.isArray(cJson)
          ? cJson
          : [];

        if (cancelled) return;

        setContacts(list);

        form.reset({
          contact_id: interaction.contact_id,
          interaction_date: interaction.interaction_date,
          type: interaction.type,
          notes: interaction.notes ?? "",
          location: interaction.location ?? null,
          duration_minutes: interaction.duration_minutes ?? null,
        });
      } catch (e: any) {
        if (!cancelled) {
          setContactsError(e?.message ?? "Failed to load data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSubmit(values: InteractionCreateInput) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/interactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...values,
          location: values.location ? values.location : null,
          duration_minutes:
            values.duration_minutes === null || values.duration_minutes === undefined
              ? null
              : Number(values.duration_minutes),
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Update failed (${res.status}): ${txt}`);
      }

      router.push("/interactions");
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="shadow-lg border-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5 text-primary" />
          Edit Interaction
        </CardTitle>
        <CardDescription>Update your interaction details.</CardDescription>
      </CardHeader>

      {loading ? (
        <CardContent className="py-10 text-sm text-muted-foreground">Loading...</CardContent>
      ) : contactsError ? (
        <CardContent className="py-10 text-sm text-red-500">{contactsError}</CardContent>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField id="contact_id" label="Contact" error={form.formState.errors.contact_id}>
              <Select
                value={form.watch("contact_id") || "_"}
                onValueChange={(v) => form.setValue("contact_id", v === "_" ? "" : v)}
              >
                <SelectTrigger id="contact_id" className="w-full">
                  <SelectValue placeholder="Select a contact" />
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
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField id="interaction_date" label="Date" error={form.formState.errors.interaction_date}>
                <Input id="interaction_date" type="date" {...form.register("interaction_date")} />
              </FormField>

              <FormField id="type" label="Type" error={form.formState.errors.type}>
                <Select value={form.watch("type")} onValueChange={(v) => form.setValue("type", v as any)}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="location" label="Location (optional)" error={form.formState.errors.location}>
                <Input id="location" placeholder="Office, Café, Zoom..." {...form.register("location")} />
              </FormField>

              <FormField id="duration_minutes" label="Duration (minutes, optional)" error={form.formState.errors.duration_minutes}>
                <Input
                  id="duration_minutes"
                  type="number"
                  min={0}
                  placeholder="30"
                  value={form.watch("duration_minutes") ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    form.setValue("duration_minutes", v === "" ? null : Number(v));
                  }}
                />
              </FormField>
            </div>

            <FormField id="notes" label="Notes" error={form.formState.errors.notes}>
              <Textarea
                id="notes"
                placeholder="What did you talk about? Any follow-up?"
                className="resize-none"
                {...form.register("notes")}
              />
            </FormField>
          </CardContent>

          <CardFooter className="flex justify-between border-t mt-4 p-6 bg-muted/40">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>
              Cancel
            </Button>

            <Button type="submit" disabled={submitting} className="min-w-32">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
