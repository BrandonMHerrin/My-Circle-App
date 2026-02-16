"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InteractionCreateInput>({
    resolver: zodResolver(interactionCreateSchema),
    defaultValues: {
      contact_id: "",
      interaction_date: "",
      type: "call",
      notes: "",
      location: null,
      duration_minutes: null,
    },
  });

  const contactOptions = useMemo(() => {
    return contacts.map((c) => ({
      id: c.id,
      label:
        `${c.fname ?? ""} ${c.lname ?? ""}`.trim() ||
        c.email ||
        "Unnamed Contact",
    }));
  }, [contacts]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Invalid interaction id");
        }

        const [interactionRes, contactsRes] = await Promise.all([
          fetch(`/api/interactions/${id}`, { credentials: "include" }),
          fetch(`/api/contacts?limit=100&offset=0`, { credentials: "include" }),
        ]);

        const interactionJson = await interactionRes.json().catch(() => null);

        if (!interactionRes.ok || !interactionJson?.interaction) {
          const msg =
            typeof interactionJson?.error === "string"
              ? interactionJson.error
              : "Failed to load interaction";
          throw new Error(msg);
        }

        const interaction: Interaction = interactionJson.interaction;

        const contactsJson = await contactsRes.json().catch(() => null);
        const list: Contact[] = Array.isArray(contactsJson?.data)
          ? contactsJson.data
          : Array.isArray(contactsJson)
            ? contactsJson
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
          setError(e.message ?? "Failed to load interaction");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, form]);

  async function onSubmit(values: InteractionCreateInput) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/interactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...values,
          location: values.location || null,
          duration_minutes:
            values.duration_minutes === null
              ? null
              : Number(values.duration_minutes),
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Update failed");
      }

      router.push("/interactions");
      router.refresh();
    } catch (e: any) {
      alert(e.message ?? "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-neutral-700">Loading...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        id="contact_id"
        label="Contact"
        error={form.formState.errors.contact_id}
      >
        <Select
          value={form.watch("contact_id") || "_"}
          onValueChange={(v) => form.setValue("contact_id", v === "_" ? "" : v)}
        >
          <SelectTrigger className="w-full bg-white/50">
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
          <Input type="date" className="bg-white/50" {...form.register("interaction_date")} />
        </FormField>

        <FormField id="type" label="Type" error={form.formState.errors.type}>
          <Select
            value={form.watch("type")}
            onValueChange={(v) => form.setValue("type", v as any)}
          >
            <SelectTrigger className="bg-white/50">
              <SelectValue />
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
          <Input className="bg-white/50" {...form.register("location")} />
        </FormField>

        <FormField id="duration_minutes" label="Duration (minutes)" error={form.formState.errors.duration_minutes}>
          <Input
            type="number"
            min={0}
            className="bg-white/50"
            value={form.watch("duration_minutes") ?? ""}
            onChange={(e) =>
              form.setValue(
                "duration_minutes",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        </FormField>
      </div>

      <FormField id="notes" label="Notes" error={form.formState.errors.notes}>
        <Textarea className="resize-none min-h-[120px] bg-white/50" {...form.register("notes")} />
      </FormField>

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

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto min-w-32 font-bold">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
