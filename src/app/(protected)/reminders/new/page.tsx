import Header from "@/components/shared/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StickerCard } from "@/components/notebook/sticker-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import NewReminderForm from "@/components/reminders/new-reminder-form";

export default function NewReminderPage() {
  return (
    <>
      <Header
        title="New Reminder"
        subtitle="Create a reminder for a contact"
        backHref="/reminders"
        rightTop={
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl bg-white hover:bg-white/90">
              Go to Dashboard
            </Button>
          </Link>
        }
      />

      {/* ✅ estilo rojo */}
      <StickerCard
        tone="rose"
        tiltIndex={2}
        className="mt-6 bg-rose-100/70 ring-1 ring-rose-200"
      >
        <CardContent className="p-3 sm:p-6">
          <NewReminderForm />
        </CardContent>
      </StickerCard>
    </>
  );
}
