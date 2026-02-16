// src/app/(protected)/reminders/page.tsx
import Header from "@/components/shared/header";
import { StickerCard } from "@/components/notebook/sticker-card";
import { CardContent } from "@/components/ui/card";
import { Suspense } from "react";

import {
  ReminderList,
  ReminderListSkeleton,
} from "@/components/reminders/reminder-list";

export default async function RemindersPage() {
  return (
    <>
      <Header
        title="Reminders"
        subtitle="Manage your reminders"
        backHref="/dashboard"   // ✅ botón con flecha
      />

      <div className="mt-6">
        <Suspense fallback={<ReminderListSkeleton />}>
          <ReminderList limit={50} />
        </Suspense>
      </div>
    </>
  );
}
