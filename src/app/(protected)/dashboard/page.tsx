// src/app/(protected)/dashboard/page.tsx
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, LogOut } from "lucide-react";
import Header from "@/components/shared/header";
import Link from "next/link";
import { Suspense } from "react";

import { StickerCard } from "@/components/notebook/sticker-card";

import {
  DashboardHeader,
  DashboardHeaderSkeleton,
} from "@/components/dashboard/dashboard-header";

import {
  InteractionsFeed,
  InteractionsFeedSkeleton,
} from "@/components/dashboard/interaction-feed";

import {
  ReminderList,
  ReminderListSkeleton,
} from "@/components/reminders/reminder-list";

import { AISugestions } from "@/components/dashboard/ai-insights";
import { AISuggestionsSkeleton } from "@/components/dashboard/ai-insights-feed";

export default async function DashboardPage() {
  const userName = "Alejandro Moncada";

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Your notebook for contacts, interactions, and reminders"
        rightTop={
          <>
            {/* ✅ Mobile: solo Logout */}
            <div className="flex items-center sm:hidden">
              <form action="/auth/logout" method="post">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="rounded-xl bg-white/70 hover:bg-white/90"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2">Logout</span>
                </Button>
              </form>
            </div>

            {/* ✅ Desktop/Tablet: Welcome + Logout */}
            <div className="hidden sm:flex items-center gap-4 rounded-xl bg-white/60 px-4 py-2 ring-1 ring-black/5 shadow-sm">
              <span className="text-sm text-neutral-700">
                Welcome,{" "}
                <span className="font-semibold text-neutral-900">
                  {userName}
                </span>
              </span>

              <form action="/auth/logout" method="post">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-xl bg-white hover:bg-white/90"
                >
                  Logout
                </Button>
              </form>
            </div>
          </>
        }
      />

      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* LEFT */}
        <StickerCard
          tone="orange"
          tiltIndex={1}
          className="lg:col-span-7 lg:self-stretch"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-neutral-900">
              Recent Activity
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 flex flex-col h-full">
            <div className="flex-1 min-h-0">
              <Suspense fallback={<InteractionsFeedSkeleton />}>
                <InteractionsFeed />
              </Suspense>
            </div>
          </CardContent>
        </StickerCard>

        {/* RIGHT */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <StickerCard tone="grape" tiltIndex={4}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-900">
                Quick Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <Button
                className="justify-start gap-2 rounded-xl bg-[#2D2A7A] text-white hover:bg-[#231f63]"
                asChild
              >
                <Link href="/interactions/new">
                  <Activity className="h-4 w-4" />
                  Log Interaction
                </Link>
              </Button>

              <Button
                className="justify-start gap-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
                asChild
              >
                <Link href="/contacts/new">
                  <Users className="h-4 w-4" />
                  Add Contact
                </Link>
              </Button>
            </CardContent>
          </StickerCard>

          <StickerCard
            tone="grape"
            tiltIndex={3}
            className="bg-[#0B1F3B] text-white"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">
                AI Insights
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Suspense fallback={<AISuggestionsSkeleton />}>
                <AISugestions />
              </Suspense>
            </CardContent>
          </StickerCard>
        </div>
      </section>

      {/* Upcoming Reminders abajo */}
      <section className="mt-6">
        <div className="mx-auto w-full max-w-5xl">
          <Suspense fallback={<ReminderListSkeleton />}>
            <ReminderList limit={3} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
