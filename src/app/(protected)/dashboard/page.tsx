// UI components from shadcn for consistent design across the app
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons used for visual clarity in dashboard elements
import { Users, Activity, Bell, Plus } from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";

/**
 * DashboardPage
 * Main landing page after user authentication.
 * Provides a high-level overview of contacts, interactions, and reminders.
 */
export default async function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Overview of your contacts and interactions" />
      {/* ===== STATS / INSIGHTS SECTION (MY-21) ===== */}
      {/* High-level metrics to provide meaningful insights */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Contacts */}
        <Link href="/contacts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contacts
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">12</div>
            </CardContent>
          </Card>
        </Link>
        {/* Recent Interactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Interactions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">5</div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Reminders
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">3</div>
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
            <ActivityItem
              text="Called John Doe"
              time="2 days ago"
              type="Call"
            />
            <ActivityItem
              text="Met with Jane Smith"
              time="4 days ago"
              type="Meeting"
            />
            <ActivityItem
              text="Sent follow-up email"
              time="1 week ago"
              type="Email"
            />
          </CardContent>
        </Card>

        {/* Quick Actions (MY-12 Navigation Support) */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="justify-start gap-2">
              <Activity className="h-4 w-4" />
              Log Interaction
            </Button>
            <Button variant="secondary" className="justify-start gap-2">
              <Users className="h-4 w-4" />
              Add Contact
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
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
