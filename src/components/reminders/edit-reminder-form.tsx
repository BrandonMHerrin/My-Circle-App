"use client";

import { z } from "zod";
import { reminderPatchSchemaForForm } from "@/lib/validation/reminder.schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FormField } from "../ui/formField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

export type ReminderFormData = z.infer<typeof reminderPatchSchemaForForm>;

const reminderTypes = ["birthday", "follow_up", "custom", "anniversary"] as const;
const reminderStatuses = ["active", "completed", "dismissed"] as const;

export default function EditReminderForm({
  reminderId,
  initialData,
}: {
  reminderId: string;
  initialData: ReminderFormData;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderPatchSchemaForForm),
    mode: "onChange",
    defaultValues: {
      ...initialData,
      reminder_date: initialData.reminder_date
        ? new Date(initialData.reminder_date)
        : null,
    },
  });

  // Sync form if initialData changes
  useEffect(() => {
    if (!initialData) return;
    form.reset({
      ...initialData,
      reminder_date: initialData.reminder_date
        ? new Date(initialData.reminder_date)
        : null,
    });
  }, [initialData, form]);

  async function handleDelete() {
    setSubmitting(true);
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?"
    );
    if (!confirmed) return setSubmitting(false);

    try {
      const res = await fetch(`/api/reminders/${reminderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any)?.error ?? "Failed to delete reminder");
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

  const onSubmit: SubmitHandler<ReminderFormData> = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        reminder_date: data.reminder_date ? data.reminder_date.toISOString() : null,
      };

      const res = await fetch(`/api/reminders/${reminderId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any)?.error ?? "Failed to update reminder");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-muted/50">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          {/* ✅ Nuevo layout: 2 columnas en lg, calendario alineado arriba */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Message */}
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

                {/* Reminder Type */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <FormField
                  id="status"
                  label="Status"
                  error={form.formState.errors.status}
                >
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? "_"}
                        onValueChange={(v) =>
                          field.onChange(v === "_" ? null : v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_">Select status</SelectItem>
                          {reminderStatuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.replace(/\b\w/g, (c) => c.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                {/* Spacer para mantener grid parejito */}
                <div className="hidden md:block" />
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
                    <div className="rounded-2xl bg-white/85 ring-1 ring-black/10 p-3 shadow-sm w-fit max-w-full overflow-x-auto">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                      />
                    </div>
                  )}
                />
              </FormField>

              <p className="text-xs text-neutral-600">
                Pick a date for the reminder.
              </p>
            </div>
          </div>
        </CardContent>

        {/* ✅ Footer más limpio y responsive */}
        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t mt-4 p-6 bg-muted/40">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button
              type="button"
              variant="destructive"
              disabled={submitting}
              onClick={handleDelete}
              className="min-w-32"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Reminder"
              )}
            </Button>

            <Button
              type="submit"
              disabled={submitting || !form.formState.isValid}
              className="min-w-32"
            >
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
        </CardFooter>
      </form>
    </Card>
  );
}
