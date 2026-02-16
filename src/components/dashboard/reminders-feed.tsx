// src/components/dashboard/reminders-feed.tsx
import Link from "next/link";
import { Bell, CalendarClock } from "lucide-react";
import { StickerCard } from "@/components/notebook/sticker-card";
import { createClient } from "@/lib/supabase/server";

type Row = {
  id: string;
  reminder_date: string;
  reminder_type: string;
  status: string;
  message: string | null;
  contact?: {
    fname: string | null;
    lname: string | null;
  } | null;
};

function fmtWhen(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function niceType(t: string) {
  const s = (t || "custom").replace("_", " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function RemindersFeed() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminders")
    .select(
      `
      id,
      reminder_date,
      reminder_type,
      status,
      message,
      contact:contacts (fname, lname)
    `
    )
    .eq("status", "active")
    .order("reminder_date", { ascending: true })
    .limit(8);

  return (
    // ✅ CAMBIADO: mint -> rose (rosado/rojo como quieres)
    <StickerCard tone="rose" tiltIndex={5} className="w-full p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* ✅ Icono más “rojo” y más marcado */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 ring-1 ring-black/10">
            <Bell className="h-6 w-6 text-rose-700" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900">
              Upcoming Reminders
            </h3>
            <p className="text-sm text-neutral-700">
              Stay on top of your follow-ups.
            </p>
          </div>
        </div>

        <Link
          href="/reminders/new"
          className="text-sm font-semibold text-rose-700 hover:underline"
        >
          + New Reminder
        </Link>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-rose-700">Failed to load reminders.</p>
      ) : (data ?? []).length === 0 ? (
        <p className="mt-4 text-sm text-neutral-700">
          Stay on top of your follow-ups.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data as Row[]).map((r) => {
            const name =
              `${r.contact?.fname ?? ""} ${r.contact?.lname ?? ""}`.trim() ||
              "Unknown";
            const msg = r.message?.trim() || "Reminder";

            return (
              <Link
                key={r.id}
                href={`/reminders/${r.id}/edit`}
                className="
                  block rounded-2xl bg-white/85 ring-1 ring-black/10 p-4
                  shadow-sm transition-all hover:shadow-md hover:bg-white
                "
              >
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {msg}
                </p>
                <p className="mt-1 text-sm text-neutral-700 truncate">{name}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-rose-700">
                  <CalendarClock className="h-4 w-4" />
                  <span>{fmtWhen(r.reminder_date)}</span>

                  {/* ✅ tag del tipo más “rojo” */}
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-800 ring-1 ring-rose-200">
                    {niceType(r.reminder_type)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </StickerCard>
  );
}

export function RemindersFeedSkeleton() {
  return (
    // ✅ Skeleton rosado
    <div className="h-[180px] rounded-2xl bg-[#FFD1D8] animate-pulse ring-1 ring-black/5" />
  );
}
