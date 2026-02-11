// app/test/notifications/page.tsx
import { ReminderCardWrapper } from "@/components/reminders/reminder-card-wrapper";
import { ReminderNotifications } from "@/components/reminders/reminder-notifications";
import { Tables } from "@/lib/supabase/database.types";

const mockReminders: Tables<"reminders">[] = [
  {
    id: "r1",
    user_id: "u1",
    contact_id: "c1",
    message: "Wish Alex a happy birthday 🎉",
    reminder_date: "2026-02-07T03:00:00.000Z",
    reminder_type: "birthday",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "r2",
    user_id: "u1",
    contact_id: "c2",
    message: "Follow up after last call",
    reminder_date: "2026-02-08T03:00:00.000Z",
    reminder_type: "follow_up",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "r3",
    user_id: "u1",
    contact_id: "c2",
    message: "Follow up after last call",
    reminder_date: "2026-02-14T03:00:00.000Z",
    reminder_type: "follow_up",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
const mockReminder: Tables<"reminders">[] = [
  {
    id: "r4",
    user_id: "u1",
    contact_id: "c2",
    message: "card wrapper test",
    reminder_date: "2026-02-14T03:00:00.000Z",
    reminder_type: "follow_up",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function NotificationsTestPage() {
  return (
    <>
      <div className="max-w-sm p-1">
        <ReminderNotifications initialReminders={mockReminders} />
      </div>
      <div className="max-w-sm p-1">
        <ReminderCardWrapper reminder={mockReminder[0]} />
      </div>
    </>
  );
}
