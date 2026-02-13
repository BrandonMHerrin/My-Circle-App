import Header from "@/components/shared/header";
import ReminderForm from "@/components/reminders/edit-reminder-form";
import { createClient } from "@/lib/supabase/server";

export default async function EditReminderPage({params}: {params: {id: string}}) {
  const {id} = await params;
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
    ... reminderData,
    reminder_date: reminderData.reminder_date
    ? new Date(reminderData.reminder_date)
    : null,
};
     
  return (
    <>
      <Header title="Edit Reminder" subtitle="Editing a reminder for this contact" backHref="/reminders" />
      <section>
        <ReminderForm initialData={formattedReminder} reminderId={id}/>
      </section>
    </>
  );
}