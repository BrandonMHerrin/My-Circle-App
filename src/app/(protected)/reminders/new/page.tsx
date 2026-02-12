import Header from "@/components/shared/header";
import NewReminderForm from "@/components/reminders/new-reminder-form";

export default async function NewReminderPage() {
  
  return (
    <>
      <Header title="New Reminder" subtitle="Creating a new reminder for this contact" backHref="/reminders" />
      <section>
        <NewReminderForm />
      </section>
    </>
  );
}