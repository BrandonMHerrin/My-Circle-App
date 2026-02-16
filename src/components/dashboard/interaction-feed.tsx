// src/components/dashboard/interaction-feed.tsx
import Link from "next/link";
import { Clock, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type Row = {
  id: string;
  interaction_date: string;
  notes: string | null;
  type: string | null;
  contacts?: { fname: string | null; lname: string | null } | null;
};

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function ActivityTile({
  id,
  title,
  detail,
  time,
  badge,
  today,
}: {
  id: string;
  title: string;
  detail: string;
  time: string;
  badge: string;
  today: boolean;
}) {
  const safeId = String(id ?? "").trim();
  const typeLabel = (badge || "interaction").toLowerCase();

  return (
    <Link
      href={`/interactions/${safeId}/edit`}
      className="
        block rounded-2xl px-5 py-4
        bg-white
        ring-1 ring-black/10
        shadow-sm
        transition-all
        hover:shadow-md
        hover:bg-white/95
      "
      title="Edit interaction"
    >
      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {title}
            </p>

            {/* Tipo en ROJO */}
            <span
              className="
                inline-flex items-center rounded-full
                bg-rose-50 text-rose-700
                ring-1 ring-rose-200
                px-2.5 py-0.5
                text-xs font-semibold
              "
            >
              {typeLabel}
            </span>

            {today && (
              <span className="ml-1 text-xs font-semibold text-rose-600">
                Today
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-neutral-700 truncate">{detail}</p>

          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-rose-600">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
        </div>

        {/* RIGHT icon */}
        <div className="shrink-0">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              bg-sky-100
              ring-1 ring-sky-200
            "
          >
            <MessageCircle className="h-6 w-6 text-sky-700" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export async function InteractionsFeed() {
  const supabase = await createClient();

  // ✅ trae más para poder deslizar
  const { data, error } = await supabase
    .from("interactions")
    .select("id, interaction_date, notes, type, contacts(fname, lname)")
    .order("interaction_date", { ascending: false })
    .limit(20);

  if (error) throw new Error("Failed to load interactions feed");

  const interactions = (data ?? []) as Row[];

  if (interactions.length === 0) {
    return (
      <p className="text-sm text-neutral-700">
        No interactions yet. Log one from Quick Actions.
      </p>
    );
  }

  // ✅ altura aproximada para 5 items (ajústalo si quieres)
  // Cada tile ~76-90px, con space-y-3 (12px). 5 -> ~420-460px.
  const showScroll = interactions.length > 5;

  return (
    <div
      className={[
        "space-y-3 pr-1",
        showScroll ? "max-h-[460px] overflow-y-auto" : "",
      ].join(" ")}
    >
      {interactions.map((i) => {
        const id = String(i.id ?? "").trim();
        const name =
          `${i.contacts?.fname ?? ""} ${i.contacts?.lname ?? ""}`.trim() ||
          "Unknown";
        const note = i.notes?.trim() || "No notes";

        return (
          <ActivityTile
            key={id}
            id={id}
            title={`${note} with ${name}`}
            detail={name}
            time={timeAgo(i.interaction_date)}
            badge={(i.type ?? "interaction").toLowerCase()}
            today={isToday(i.interaction_date)}
          />
        );
      })}
    </div>
  );
}

export function InteractionsFeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((k) => (
        <div
          key={k}
          className="h-20 rounded-2xl bg-white/60 ring-1 ring-black/5 animate-pulse"
        />
      ))}
    </div>
  );
}
