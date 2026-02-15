// src/components/reminders/reminder-list.tsx
import Link from "next/link";
import { Bell, Plus, CalendarClock } from "lucide-react";
import { StickerCard } from "@/components/notebook/sticker-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

type ReminderRow = {
  id: string;
  reminder_type: "birthday" | "follow_up" | "custom" | "anniversary";
  status: "active" | "dismissed" | "completed";
  message: string | null;
  reminder_date: string;
  contact?: {
    id: string;
    fname: string | null;
    lname: string | null;
  } | null;
};

function prettyType(t: ReminderRow["reminder_type"]) {
  return t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isPast(iso: string) {
  const d = new Date(iso).getTime();
  const now = Date.now();
  return d < now;
}

export async function ReminderList({ limit = 3 }: { limit?: number }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminders")
    .select(
      `
      id,
      reminder_type,
      status,
      message,
      reminder_date,
      contact:contacts (
        id, fname, lname
      )
    `,
    )
    // ✅ mostrar todos los activos (no ocultar por fecha)
    .not("status", "in", "(dismissed,completed)")
    .order("reminder_date", { ascending: true })
    .limit(limit);

  if (error) {
    return (
      <StickerCard tone="mint" tiltIndex={5} className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-black/10">
                <Bell className="h-5 w-5 text-neutral-800" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-neutral-900 truncate">
                  Upcoming Reminders
                </h3>
                <p className="text-sm text-neutral-700 truncate">
                  Stay on top of your follow-ups.
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-xl bg-white/70 hover:bg-white/90 shrink-0"
            >
              <Link href="/reminders/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Reminder
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-rose-700">
            Failed to load reminders: {error.message}
          </p>
        </div>
      </StickerCard>
    );
  }

  const reminders = (data ?? []) as ReminderRow[];

  return (
    <StickerCard tone="mint" tiltIndex={5} className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-black/10">
              <Bell className="h-5 w-5 text-neutral-800" />
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-neutral-900 truncate">
                Upcoming Reminders
              </h3>
              <p className="text-sm text-neutral-700 truncate">
                Stay on top of your follow-ups.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-xl bg-white/70 hover:bg-white/90 shrink-0"
          >
            <Link href="/reminders/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Reminder
            </Link>
          </Button>
        </div>

        {/* panel interno para que nada sobresalga */}
        <div className="mt-4 rounded-3xl bg-white/45 ring-1 ring-black/10 p-5 overflow-hidden">
          {reminders.length === 0 ? (
            <p className="text-sm text-neutral-700">
              No reminders yet. Add one to stay connected.
            </p>
          ) : (
            <div className="space-y-3">
              {reminders.map((r) => {
                const name =
                  `${r.contact?.fname ?? ""} ${r.contact?.lname ?? ""}`.trim() ||
                  "Contact";

                const overdue = isPast(r.reminder_date);

                return (
                  <Link
                    key={r.id}
                    href={`/reminders/${r.id}/edit`}
                    className="block rounded-2xl bg-white/85 ring-1 ring-black/10 p-4 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    title="Edit reminder"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {r.message?.trim() || "(no message)"}
                        </p>
                        <p className="mt-1 text-sm text-neutral-700 truncate">
                          {name}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-rose-700">
                            <CalendarClock className="h-4 w-4" />
                            {formatDateTime(r.reminder_date)}
                          </span>

                          <Badge variant="secondary" className="rounded-full">
                            {prettyType(r.reminder_type)}
                          </Badge>

                          {overdue && (
                            <span className="text-xs font-semibold text-rose-700">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StickerCard>
  );
}

export function ReminderListSkeleton() {
  return (
    <div className="rounded-2xl ring-1 ring-black/5 bg-[#CFF5E7] animate-pulse overflow-hidden">
      <div className="p-6">
        <div className="h-10 w-64 rounded-xl bg-white/40" />
        <div className="mt-4 h-24 rounded-2xl bg-white/35" />
      </div>
    </div>
  );
}
