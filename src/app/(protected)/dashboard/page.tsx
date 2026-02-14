
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, Plus } from "lucide-react";
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
  RemindersFeed,
  RemindersFeedSkeleton,
} from "@/components/dashboard/reminders-feed";

import AssistantChat from "@/components/assistant/assistant-chat";

export default async function DashboardPage() {
  const userName = "Alejandro Moncada";

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Your notebook for contacts, interactions, and reminders"
        rightTop={
          <div className="flex items-center gap-4 rounded-xl bg-white/60 px-4 py-2 ring-1 ring-black/5 shadow-sm">
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
        }
      />

      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN — Recent Activity */}
        <StickerCard tone="orange" tiltIndex={1} className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-neutral-900">
              Recent Activity
            </CardTitle>

            <Link href="/interactions/new">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 rounded-xl border-neutral-300 bg-white/70 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                New Interaction
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            <Suspense fallback={<InteractionsFeedSkeleton />}>
              <InteractionsFeed />
            </Suspense>
          </CardContent>
        </StickerCard>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* 1️⃣ Quick Actions */}
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

          {/* 2️⃣ Upcoming Reminders */}
          <Suspense fallback={<RemindersFeedSkeleton />}>
            <RemindersFeed />
          </Suspense>

          {/* 3️⃣ Assistant Chat abajo */}
          <StickerCard tone="sky" tiltIndex={2}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-900">
                Assistant
              </CardTitle>
            </CardHeader>

            <CardContent>
              <AssistantChat />
            </CardContent>
          </StickerCard>
        </div>
      </section>
    </>
  );
}
