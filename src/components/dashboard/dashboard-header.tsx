import { createClient } from "@/lib/supabase/server";
import { MetricCard, MetricCardSkeleton } from "../shared/metric-card";
import { Activity, Bell, Users } from "lucide-react";

const SEVEN_DAYS_AGO_ISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

/**
 * DashboardHeader
 *
 * A server component that fetches key metrics for the dashboard header and renders MetricCard components.
 * This component is responsible for displaying high-level statistics such as total contacts and recent interactions.
 * It uses the createClient function to interact with Supabase and retrieve the necessary data for each metric.
 * Each metric is displayed using the MetricCard component, which provides a consistent UI for displaying these statistics.
 *
 * @returns A JSX element containing the dashboard header with key metrics.
 */
export async function DashboardHeader() {
  const supabase = await createClient();

  // Contacts count
  const { count: contactsCount, error: contactsError } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true });

  if (contactsError) {
    throw new Error("Failed to load contacts count");
  }

  // Recent interactions count
  const { count: recentInteractionsCount, error: interactionsError } = await supabase
    .from("interactions")
    .select("*", { count: "exact", head: true })
    .gte("interaction_date", SEVEN_DAYS_AGO_ISO);

  if (interactionsError) {
    throw new Error("Failed to load recent interactions count");
  }

  // Total interactions count 
  const { count: totalInteractionsCount, error: totalInteractionsError } = await supabase
    .from("interactions")
    .select("*", { count: "exact", head: true });

  if (totalInteractionsError) {
    throw new Error("Failed to load total interactions count");
  }

  // Upcoming reminders count
  const { count: upcomingRemindersCount, error: remindersError } = await supabase
    .from("reminders")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (remindersError) {
    throw new Error("Failed to load upcoming reminders count");
  }

  return (
    // Dashboard header with four key metrics: total contacts, recent interactions, upcoming reminders, and recent activity
    <section className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard href="/contacts" title="Total Contacts" value={contactsCount ?? 0} icon={Users} />
      <MetricCard href="/interactions" title="Recent Interactions (Last 7 Days)" value={recentInteractionsCount ?? 0} icon={Activity} />
      <MetricCard href="/interactions" title="Total Interactions" value={totalInteractionsCount ?? 0} icon={Activity} />
      <MetricCard href="/reminders" title="Upcoming Reminders" value={upcomingRemindersCount ?? 0} icon={Bell} />
    </section>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    // Skeleton placeholders for the dashboard header metrics while data is loading
    <section className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
    </section>
  );
}