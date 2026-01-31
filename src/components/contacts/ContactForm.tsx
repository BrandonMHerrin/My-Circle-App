"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ContactFormMode, ContactFormValues } from "./types";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

/* ------------------------------------------------------------------ */
/* Schema (sin preprocess para evitar unknown) */
/* ------------------------------------------------------------------ */

const schema = z.object({
  fname: z.string().trim().min(1, "First name is required"),
  lname: z.string().trim().min(1, "Last name is required"),

  // "" o email válido
  email: z.union([z.literal(""), z.string().email("Invalid email")]).optional(),

  // "" o phone con mínimo 3 caracteres
  phone: z.union([z.literal(""), z.string().min(3, "Phone is too short")]).optional(),

  relationship: z.string().min(1, "Relationship type is required"),

  // date input devuelve "" o "YYYY-MM-DD"
  dob: z.union([z.literal(""), z.string()]).optional(),

  // "" o texto (máx 2000)
  notes: z.union([z.literal(""), z.string().max(2000, "Notes too long")]).optional(),
});

type FormData = z.infer<typeof schema>;

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

type Props = {
  mode: ContactFormMode;
  defaultValues?: Partial<ContactFormValues>;
  onSubmit: (values: ContactFormValues) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

const relationshipOptions = [
  "family",
  "friend",
  "colleague",
  "partner",
  "client",
  "neighbor",
  "other",
] as const;

function normalizeDefaults(d?: Partial<ContactFormValues>): FormData {
  return {
    fname: d?.fname ?? "",
    lname: d?.lname ?? "",
    email: (d?.email ?? "") as string, // puede venir null
    phone: (d?.phone ?? "") as string,
    relationship: d?.relationship ?? "",
    dob: (d?.dob ?? "") as string,
    notes: (d?.notes ?? "") as string,
  };
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export function ContactForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: Props) {
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const initialValues = useMemo(
    () => normalizeDefaults(defaultValues),
    [defaultValues]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const submitting = isSubmitting ?? localSubmitting;
  const relationship = watch("relationship");

  const submitText =
    submitLabel ?? (mode === "create" ? "Create Contact" : "Save Changes");

  const submit = async (values: FormData): Promise<void> => {
    const payload: ContactFormValues = {
      fname: values.fname.trim(),
      lname: values.lname.trim(),
      relationship: values.relationship.trim(),

      email: values.email && values.email !== "" ? values.email.trim() : null,
      phone: values.phone && values.phone !== "" ? values.phone.trim() : null,
      dob: values.dob && values.dob !== "" ? values.dob : null,
      notes: values.notes && values.notes !== "" ? values.notes.trim() : null,
    };

    try {
      setLocalSubmitting(true);
      await onSubmit(payload);
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input placeholder="e.g. Oscar" {...register("fname")} />
          {errors.fname && (
            <p className="text-sm text-destructive">{errors.fname.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input placeholder="e.g. Moncada" {...register("lname")} />
          {errors.lname && (
            <p className="text-sm text-destructive">{errors.lname.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email (optional)</label>
          <Input type="email" placeholder="name@email.com" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone (optional)</label>
          <Input placeholder="+56 9 1234 5678" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Relationship */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Relationship Type</label>
          <Select
            value={relationship}
            onValueChange={(v) =>
              setValue("relationship", v, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationshipOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.relationship && (
            <p className="text-sm text-destructive">
              {errors.relationship.message}
            </p>
          )}
        </div>

        {/* Birthday */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Birthday (optional)</label>
          <Input type="date" {...register("dob")} />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (optional)</label>
        <Textarea className="min-h-28" {...register("notes")} />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : submitText}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
