"use client";

// UI components from shadcn for consistent design across the app
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { Users, Activity, Bell, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

/**
 * DashboardPage
 * Main landing page after user authentication.
 * Provides a high-level overview of contacts, interactions, and reminders.
 */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      if (!user) return;
      try {
        const res = await fetch("/api/contacts");
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoadingContacts(false);
      }
    }

    if (!authLoading && user) {
      fetchContacts();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    // Full-height container using global background color
    <div className="min-h-screen bg-background">
      {/* Centered content container with max width */}
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">

        <PageHeader
          title="Dashboard"
          description="Overview of your contacts and interactions"
        />

        {/* ===== STATS / INSIGHTS SECTION (MY-21) ===== */}
        {/* High-level metrics to provide meaningful insights */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contacts
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {loadingContacts ? "..." : contacts.length}
              </div>
            </CardContent>
          </Card>

          {/* Recent Interactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Interactions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">0</div>
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
              <div className="text-3xl font-semibold">0</div>
            </CardContent>
          </Card>
        </section>

        {/* ===== MAIN CONTENT SECTION ===== */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Recent Activity Feed (MY-22) */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Contacts</CardTitle>
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <Link href="/contacts/new">
                  <Plus className="h-4 w-4" />
                  New Contact
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {loadingContacts ? (
                <p className="text-sm text-muted-foreground">Loading contacts...</p>
              ) : contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No contacts yet. Start by adding one!</p>
              ) : (
                contacts.slice(0, 3).map((contact) => (
                  <ActivityItem
                    key={contact.id}
                    id={contact.id}
                    text={`${contact.fname} ${contact.lname}`}
                    time={new Date(contact.created_at).toLocaleDateString()}
                    type={contact.relationship}
                  />
                ))
              )}
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
              <Button variant="secondary" className="justify-start gap-2" asChild>

                <Link href="/contacts/new">Add Contact <Users className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

        </section>
      </div>
    </div>
  );
}

/**
 * ActivityItem
 * Reusable component for displaying a single interaction in the activity feed.
 */
function ActivityItem({
  id,
  text,
  time,
  type,
}: {
  id: string;
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
      <Button size="sm" variant="ghost" asChild>
        <Link href={`/contacts/${id}/edit`}>View</Link>
      </Button>
    </div>
  );
}
