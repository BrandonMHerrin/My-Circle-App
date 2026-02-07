// UI components from shadcn for consistent design across the app
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons used for visual clarity in dashboard elements
import { Users, Activity, Plus } from "lucide-react";
import Header from "@/components/shared/header";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardHeader, DashboardHeaderSkeleton } from "@/components/dashboard/dashboard-header";
import { InteractionsFeed, InteractionsFeedSkeleton } from "@/components/dashboard/interaction-feed";

/**
 * DashboardPage
 * Main landing page after user authentication.
 * Provides a high-level overview of contacts, interactions, and reminders.
 */
export default async function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Overview of your contacts and interactions" />
      
      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      {/* ===== MAIN CONTENT SECTION ===== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity Feed (MY-22) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/interactions/new">
              <Button size="sm" variant="outline" className="gap-2">
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
        </Card>

        {/* Quick Actions (MY-12 Navigation Support) */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="dashboard" className="justify-start gap-2" asChild>
              <Link href="/interactions/new">
                <Activity className="h-4 w-4" />
                Log Interaction
              </Link>
            </Button>
            <Button variant="dashboard" className="justify-start gap-2" asChild>
              <Link href="/contacts/new">
                <Users className="h-4 w-4" />
                Add Contact
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}