// UI components from shadcn for consistent design across the app
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons used for visual clarity in dashboard elements
import { Users, Activity, Bell, Plus } from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * DashboardPage
 * Main landing page after user authentication.
 * Provides a high-level overview of contacts, interactions, and reminders.
 */
const SEVEN_DAYS_AGO_ISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

export default async function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Overview of your contacts and interactions" />
      {/* ===== STATS / INSIGHTS SECTION (MY-21) ===== */}
      {/* High-level metrics to provide meaningful insights */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Contacts */}
        <Link href="/contacts" className="block">
          <Card className="h-full hover:bg-muted transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contacts
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-8 w-16" />}>
                <ContactsCount />
              </Suspense>
            </CardContent>
          </Card>
        </Link>
        {/* Recent Interactions */}
        <Card className="hover:bg-muted transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Interactions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-8 w-16" />}>
              <RecentInteractionsCount />
            </Suspense>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card className="hover:bg-muted transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Reminders
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">3</div>
            <div className="text-sm text-muted-foreground">upcoming reminders</div>
          </CardContent>
        </Card>
      </section>

      {/* ===== MAIN CONTENT SECTION ===== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity Feed (MY-22) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Interaction
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
              <RecentInteractions />
            </Suspense>
          </CardContent>
        </Card>

        {/* Quick Actions (MY-12 Navigation Support) */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="dashboard" className="justify-start gap-2">
              <Activity className="h-4 w-4" />
              Log Interaction
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

async function ContactsCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error("Failed to load contacts count");
  }
  return <div className="text-3xl font-semibold">{count ?? 0}</div>;
}

async function RecentInteractionsCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("interactions")
    .select("*", { count: "exact", head: true })
     .gte("interaction_date", SEVEN_DAYS_AGO_ISO);

  if (error) {
    throw new Error("Failed to load recent interactions count");
  }
  return <div className="text-3xl font-semibold">{count ?? 0}</div>;
}

async function RecentInteractions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interactions")
    .select("id, type, interaction_date, contacts(fname, lname)")
    .gte("interaction_date", SEVEN_DAYS_AGO_ISO)
    .order("interaction_date", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error("Failed to load recent interactions");
  }
  // if no interactions, show a friendly message
  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground">No interactions in the last 7 days.</p>;
  }
  return <>{data.map((interaction) => (
    <ActivityItem
      key={interaction.id}
      text={`${interaction.type} with ${interaction.contacts?.fname} ${interaction.contacts?.lname}`}
      time={new Date(interaction.interaction_date).toLocaleString()}
      type={interaction.type}
    />
  ))}</>;
}

/**
 * ActivityItem
 * Reusable component for displaying a single interaction in the activity feed.
 */
function ActivityItem({
  text,
  time,
  type,
}: {
  text: string;
  time: string;
  type: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">{text}</p>
          <Badge variant="secondary">{type}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <Button size="sm" variant="ghost">
        View
      </Button>
    </div>
  );
}
