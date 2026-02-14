// src/components/dashboard/dashboard-header.tsx
import React from "react";
import Link from "next/link";
import { Users, Activity, Bell } from "lucide-react";
import { StickerCard } from "@/components/notebook/sticker-card";

function MiniStatSticker({
  title,
  value,
  icon: Icon,
  tone,
  tiltIndex,
  href,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  tone: "lemon" | "sky" | "rose" | "mint" | "peach" | "paper" | "grape" | "orange";
  tiltIndex: number;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <StickerCard
        tone={tone}
        tiltIndex={tiltIndex}
        className="px-4 py-3 cursor-pointer transition-transform hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-neutral-700">{title}</p>
            <p className="mt-0.5 text-xl font-semibold text-neutral-900">
              {value}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/55 ring-1 ring-black/5">
            <Icon className="h-5 w-5 text-neutral-800" />
          </div>
        </div>
      </StickerCard>
    </Link>
  );
}

export function DashboardHeader() {
  const stats = [
    {
      title: "Contacts",
      value: "24",
      icon: Users,
      tone: "lemon" as const,
      tiltIndex: 1,
      href: "/contacts",
    },
    {
      title: "Interactions",
      value: "8",
      icon: Activity,
      tone: "sky" as const,
      tiltIndex: 2,
      href: "/interactions",
    },
    {
      title: "Reminders",
      value: "3",
      icon: Bell,
      tone: "rose" as const,
      tiltIndex: 3,
      href: "/reminders",
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <MiniStatSticker
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            tone={s.tone}
            tiltIndex={s.tiltIndex}
            href={s.href}
          />
        ))}
      </div>
    </div>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[74px] rounded-2xl bg-neutral-900/5 animate-pulse ring-1 ring-black/5"
        />
      ))}
    </div>
  );
}
