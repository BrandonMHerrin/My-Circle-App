import React from "react";
import Link from "next/link";
import { Users, Activity, Bell } from "lucide-react";
import { StickerCard } from "@/components/notebook/sticker-card";
import { createClient } from "@/lib/supabase/server";

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

export async function DashboardHeader() {
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  const userId = auth?.user?.id;

  // Si por alguna razón no hay sesión, muestra 0
  if (!userId) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MiniStatSticker title="Contacts" value="0" icon={Users} tone="lemon" tiltIndex={1} href="/contacts" />
          <MiniStatSticker title="Interactions" value="0" icon={Activity} tone="sky" tiltIndex={2} href="/interactions" />
          <MiniStatSticker title="Reminders" value="0" icon={Bell} tone="rose" tiltIndex={3} href="/reminders" />
        </div>
      </div>
    );
  }

  const [{ count: contactsCount }, { count: interactionsCount }, { count: remindersCount }] =
    await Promise.all([
      supabase.from("contacts").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("interactions").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("reminders").select("*", { count: "exact", head: true }).eq("user_id", userId),
    ]);

  const stats = [
    {
      title: "Contacts",
      value: String(contactsCount ?? 0),
      icon: Users,
      tone: "lemon" as const,
      tiltIndex: 1,
      href: "/contacts",
    },
    {
      title: "Interactions",
      value: String(interactionsCount ?? 0),
      icon: Activity,
      tone: "sky" as const,
      tiltIndex: 2,
      href: "/interactions",
    },
    {
      title: "Reminders",
      value: String(remindersCount ?? 0),
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
