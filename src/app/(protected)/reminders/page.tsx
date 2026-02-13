import Header from "@/components/shared/header";
import RemindersList from "@/components/reminders/reminder-list";

export default function InteractionsPage() {
  return (
    <>
      <Header title="Reminders" subtitle="Manage your Reminders" backHref="/dashboard" />
      <section className="space-y-4">
        <RemindersList />
      </section>
    </>
  );
}
