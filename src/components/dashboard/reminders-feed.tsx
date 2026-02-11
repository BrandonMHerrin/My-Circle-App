import { createClient } from "@/lib/supabase/server";
import { ReminderNotifications } from "../reminders/reminder-notifications";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export async function RemindersFeed() {
  const supabase = await createClient();

  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0); // Set to start of the day
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(todaysDate.getDate() + 14);
  twoWeeksFromNow.setHours(23, 59, 59, 999); // Set to end of the day

  // Fetch upcoming reminders (next 7 days)
  const { data: reminders, error } = await supabase
    .from("reminders")
    .select("*")
    .lte("reminder_date", twoWeeksFromNow.toISOString())
    .eq("status", "active")
    .order("reminder_date", { ascending: true });

  if (error) {
    throw new Error("Failed to load reminders");
  }

  console.log("Loaded reminders: ", reminders.length ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        <ReminderNotifications initialReminders={reminders ?? []} />
      </CardContent>
    </Card>
  );
}

export function RemindersFeedSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-md" />
        ))}
      </CardContent>
    </Card>
  );
}
