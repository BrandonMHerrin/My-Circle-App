import Header from "@/components/shared/header";
import ReminderForm from "@/components/reminders/edit-reminder-form";
import { createClient } from "@/lib/supabase/server";
import { StickerCard } from "@/components/notebook/sticker-card";
import { CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditReminderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: reminderData, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading reminder:", error);
    throw new Error("Failed to load reminder data");
  }

  const formattedReminder = {
    ...reminderData,
    reminder_date: reminderData.reminder_date
      ? new Date(reminderData.reminder_date)
      : null,
  };

  return (
    <>
      <Header
        title="Edit Reminder"
        subtitle="Update your follow-up details"
        backHref="/reminders"
        rightTop={
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl bg-white/70">
              Go to Dashboard
            </Button>
          </Link>
        }
      />

      <StickerCard
        tone="rose"
        tiltIndex={2}
        className="mt-6 bg-rose-100/80 ring-1 ring-rose-300"
      >
        <CardContent className="p-3 sm:p-6">
          <ReminderForm
            initialData={formattedReminder}
            reminderId={id}
          />
        </CardContent>
      </StickerCard>
    </>
  );
}
