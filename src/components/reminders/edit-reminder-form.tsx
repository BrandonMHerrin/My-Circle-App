"use client";

import { z } from "zod";
import {
  reminderPatchSchemaForForm,
  reminderTypeEnum,
  reminderStatusEnum,
} from "@/lib/validation/reminder.schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "../ui/formField";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      reminder_date: initialData.reminder_date ? new Date(initialData.reminder_date) : null,
    },
  });

  // Sync form if initialData changes
  useEffect(() => {
    if (!initialData) return;
    form.reset({
      ...initialData,
      reminder_date: initialData.reminder_date ? new Date(initialData.reminder_date) : null,
    });
  }, [initialData, form]);

  async function handleDelete() {
    setSubmitting(true);
    const confirmed = window.confirm("Are you sure you want to delete this reminder?");
    if (!confirmed) return setSubmitting(false);

    try {
      const res = await fetch(`/api/reminders/${reminderId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to delete reminder");
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
      const payload = { ...data, reminder_date: data.reminder_date
        ? data.reminder_date.toISOString()
        : null, };
      const res = await fetch(`/api/reminders/${reminderId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update reminder");
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5 text-primary" />
          Edit Reminder
        </CardTitle>
        <CardDescription>
          Update the details of your reminder.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Message */}
            <FormField id="message" label="Message" error={form.formState.errors.message}>
              <Input {...form.register("message")} placeholder="Enter reminder message" />
            </FormField>

            {/* Reminder Type */}
            <FormField id="reminder_type" label="Reminder Type" error={form.formState.errors.reminder_type}>
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
                          {type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {/* Status */}
            <FormField id="status" label="Status" error={form.formState.errors.status}>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value ?? "_"} onValueChange={(v) => field.onChange(v === "_" ? null : v)}>
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

            {/* Reminder Date */}
            <FormField id="reminder_date" label="Reminder Date" error={form.formState.errors.reminder_date}>
              <Controller
                control={form.control}
                name="reminder_date"
                render={({ field }) => (
                  <Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} />
                )}
              />
            </FormField>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t mt-4 p-6 bg-muted/40">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>
            Cancel
          </Button>

          <Button type="button" variant="destructive" disabled={submitting} onClick={handleDelete} className="min-w-32">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : "Delete Reminder"}
          </Button>

          <Button type="submit" disabled={submitting || !form.formState.isValid} className="min-w-32">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}