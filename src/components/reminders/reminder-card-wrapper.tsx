// src/components/reminders/reminder-card-wrapper.tsx
import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { StickerCard } from "@/components/notebook/sticker-card";
import { Button } from "@/components/ui/button";

export function ReminderCardWrapper({
  title = "Upcoming Reminders",
  actionHref = "/reminders/new",
  actionLabel = "+ New Reminder",
  children,
}: {
  title?: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <StickerCard
      tone="mint"
      tiltIndex={5}
      className="w-full p-6 sm:p-8 bg-emerald-100/60 ring-1 ring-emerald-200"
    >
      <div className="rounded-3xl bg-white/45 ring-1 ring-black/10 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-black/10">
              <Bell className="h-5 w-5 text-neutral-800" />
            </div>

            <h3 className="truncate text-lg sm:text-xl font-semibold text-neutral-900">
              {title}
            </h3>
          </div>

          <Button
            asChild
            variant="ghost"
            className="shrink-0 rounded-xl px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
          >
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </StickerCard>
  );
}

export default ReminderCardWrapper;
