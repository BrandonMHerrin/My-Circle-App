import Link from "next/link";
import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
import { Users, Activity, Bell, Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1) Contacts count
  const { count: contactsCount, error: contactsErr } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true });

  if (contactsErr) throw new Error("Failed to load contacts count");

  // 2) Interactions count
  const { count: interactionsCount, error: interactionsErr } = await supabase
    .from("interactions")
    .select("*", { count: "exact", head: true });

  if (interactionsErr) throw new Error("Failed to load interactions count");

  // 3) Recent interactions (last 3)
  // Intentamos traer nombre del contacto con join.
  // Si el join falla, igual seguimos con data vacía.
  const { data: recentData, error: recentErr } = await supabase
    .from("interactions")
    .select("id, interaction_date, type, notes, contact:contacts(fname,lname)")
    .order("interaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  // No rompas el dashboard si el join no existe todavía o falla
  if (recentErr) console.error("Recent interactions error:", recentErr);

  const recentInteractions = Array.isArray(recentData) ? recentData : [];

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Overview of your contacts and interactions"
      />

      {/* ===== STATS ===== */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Contacts */}
        <Link href="/contacts">
          <Card className="hover:bg-muted transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contacts
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{contactsCount ?? 0}</div>
            </CardContent>
          </Card>
        </Link>

        {/* Interactions count (REAL) */}
        <Link href="/interactions">
          <Card className="hover:bg-muted transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interactions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{interactionsCount ?? 0}</div>
            </CardContent>
          </Card>
        </Link>

        {/* Upcoming Reminders (placeholder) */}
        <Card className="hover:bg-muted transition-colors">
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

      {/* ===== MAIN CONTENT ===== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity (REAL) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>

            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href="/interactions/new">
                <Plus className="h-4 w-4" />
                New Interaction
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentInteractions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No interactions yet. Create your first one!
              </p>
            ) : (
              recentInteractions.map((it: any) => {
                const contactName =
                  (it?.contact &&
                    `${it.contact.fname ?? ""} ${it.contact.lname ?? ""}`.trim()) ||
                  "Contact";

                const dateText = it?.interaction_date ?? "—";
                const typeText = it?.type ?? "other";
                const notesPreview = (it?.notes ?? "").trim();

                return (
                  <ActivityItem
                    key={it.id}
                    text={`${contactName}`}
                    time={`${dateText}${notesPreview ? ` • ${notesPreview.slice(0, 60)}${notesPreview.length > 60 ? "..." : ""}` : ""}`}
                    type={typeText}
                  />
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
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
      <Button size="sm" variant="ghost" asChild>
        <Link href="/interactions">View</Link>
      </Button>
    </div>
  );
}
