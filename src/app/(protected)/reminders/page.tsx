
import Header from "@/components/shared/header";
import NewReminderForm from "@/components/reminders/new-reminder-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewReminderPage() {
  return (
    <>
      <Header
        title="New Reminder"
        subtitle="Create a reminder to stay connected"
        backHref="/reminders"
      />

      <div className="flex justify-end mb-4">
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-xl">
            Go to Dashboard
          </Button>
        </Link>
      </div>

      <section>
        <NewReminderForm />
      </section>
    </>
  );
}
