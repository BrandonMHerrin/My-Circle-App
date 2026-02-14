// src/components/dashboard/interaction-feed.tsx
import React from "react";
import { Clock, MessageCircle } from "lucide-react";

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

function ActivityTile({ item }: { item: ActivityItem }) {
  return (
    <div
      className="
        rounded-2xl px-4 py-3
        bg-white
        ring-1 ring-black/10
        shadow-sm
        transition-all
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">
            {item.title}
          </p>

          <p className="mt-1 text-sm text-neutral-700">{item.detail}</p>

          {/* ✅ Hora en color más atractivo */}
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-rose-600">
            <Clock className="h-4 w-4" />
            <span>{item.time}</span>
          </div>
        </div>

        {/* ✅ Icono que resalta más */}
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2D2A7A]/10 ring-1 ring-black/5">
          <MessageCircle className="h-5 w-5 text-[#2D2A7A]" />
        </div>
      </div>
    </div>
  );
}

export function InteractionsFeed() {
  const recent: ActivityItem[] = [
    { id: "1", title: "Met with Brandon", detail: "Sprint + dashboard UI review.", time: "Today • 10:12" },
    { id: "2", title: "Follow-up: Heitor", detail: "Defined next steps for next week.", time: "Yesterday • 18:40" },
    { id: "3", title: "New note added", detail: "Saved key details from last call.", time: "2 days ago • 12:05" },
    { id: "4", title: "Interaction logged", detail: "Customer follow-up scheduled.", time: "3 days ago • 16:22" },
    { id: "5", title: "Reminder created", detail: "Set a check-in for next Monday.", time: "4 days ago • 09:10" },
  ];

  return (
    <div className="space-y-4">
      {recent.slice(0, 5).map((item) => (
        <ActivityTile key={item.id} item={item} />
      ))}
    </div>
  );
}

export function InteractionsFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-[90px] rounded-2xl bg-white ring-1 ring-black/10 animate-pulse"
        />
      ))}
    </div>
  );
}
