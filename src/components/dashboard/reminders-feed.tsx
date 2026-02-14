// src/components/dashboard/reminders-feed.tsx
import React from "react";
import { StickerCard } from "@/components/notebook/sticker-card";
import { Bell } from "lucide-react";

export function RemindersFeed() {
  return (
    // ✅ CAMBIAMOS de lemon (amarillo) a mint (verde)
    <StickerCard tone="mint" tiltIndex={3} className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-black/10">
          <Bell className="h-5 w-5 text-neutral-800" />
        </div>

        <h3 className="text-lg font-semibold text-neutral-900">
          Upcoming Reminders
        </h3>
      </div>

      <p className="mt-4 text-sm text-neutral-700">
        No upcoming reminders. Add one to stay connected.
      </p>
    </StickerCard>
  );
}

export function RemindersFeedSkeleton() {
  return (
    <div className="h-[160px] rounded-2xl bg-[#CFF5E7] animate-pulse ring-1 ring-black/5" />
  );
}
