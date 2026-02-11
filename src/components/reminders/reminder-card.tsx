"use client";

import { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  parseISO,
  format,
  isToday,
  isThisWeek,
  startOfDay,
  isAfter,
} from "date-fns";
import {
  Users,
  CalendarCheck,
  CheckCircle,
  Gift,
  Heart,
  PhoneCall,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ReminderCardProps {
  reminder: Tables<"reminders">;
  onDismiss: (id: string) => void;
}

export function ReminderCard({ reminder, onDismiss }: ReminderCardProps) {
  const router = useRouter();

  // Icon mapping for badges
  const reminderTypeIcons: Record<string, React.ReactNode> = {
    birthday: <Gift className="w-4 h-4" />,
    anniversary: <Heart className="w-4 h-4" />,
    follow_up: <PhoneCall className="w-4 h-4" />,
    custom: <Star className="w-4 h-4" />,
  };
  // Color mapping for icon badges
  const reminderTypeColors: Record<string, string> = {
    birthday: "bg-pink-100 text-pink-700",
    anniversary: "bg-red-100 text-red-700",
    follow_up: "bg-blue-100 text-blue-700",
    custom: "bg-gray-100 text-gray-700",
  };
  // Color mapping for urgency types
  const urgencyColors: Record<string, string> = {
    today: "bg-red-100 text-red-800",
    week: "bg-orange-100 text-orange-800",
    upcoming: "bg-blue-100 text-blue-800",
    past: "bg-gray-100 text-gray-600",
  };

  // Urgency label mapping for urgency types
  const urgencyLabels: Record<string, string> = {
    today: "Due Today",
    week: "Due This Week",
    upcoming: "Upcoming",
    past: "Past Due",
  };

  // Determine urgency based on reminder date
  function getDateUrgency(reminderDate: string) {
    if (!reminderDate) return "upcoming";
    const date = startOfDay(parseISO(reminderDate));
    const now = startOfDay(new Date());
    if (isToday(date)) return "today";
    if (isAfter(now, date)) return "past";
    if (isThisWeek(date, { weekStartsOn: 1 })) return "week";
    return "upcoming";
  }

  async function handleViewContact(id: string) {
    router.push(`/contacts/${id}/edit`);
    router.refresh();
  }

  async function handleUpdateStatus(id: string, status: "completed" | "dismissed") {
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? `Failed to ${status} reminder`);
      }
      router.refresh();
    } catch (err: any) {
      console.error(`Failed to ${status} reminder`, err);
    }
  }

  const getUrgencyColor = (reminderDate: string) => {
    if (!reminderDate) return "bg-gray-100 text-gray-600";
    return (
      urgencyColors[getDateUrgency(reminderDate)] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Card
      className={`w-full p-3 sm:p-4 rounded-md shadow-sm transition-all
    ${getUrgencyColor(reminder.reminder_date)}
    `}
    >
      {/* Header */}
      <CardHeader className="text-base sm:text-lg font-semibold truncate">
        {/* Reminder Type Icon */}
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${reminderTypeColors[reminder.reminder_type]}`}
        >
          {reminderTypeIcons[reminder.reminder_type]}
        </span>
      </CardHeader>

      {/* Content */}
      <CardContent className="w-full space-y-1 text-sm sm:text-base">
        {/* Message */}
        <p className="text-muted-foreground w-full truncate sm:whitespace-normal">
          Message: {reminder.message || "N/A"}
        </p>

        {/* Date */}
        {reminder.reminder_date
          ? format(startOfDay(new Date(reminder.reminder_date)), "PPP")
          : "N/A"}

        {/* Urgency Badge */}
        <span
          className={`ml-2 px-1.5 py-0.5 rounded text-xs ${urgencyColors[getDateUrgency(reminder.reminder_date ?? "")]}`}
        >
          {urgencyLabels[getDateUrgency(reminder.reminder_date ?? "")]}
        </span>

        {/* Action buttons */}
        <div className="w-full flex flex-row flex-nowrap gap-1 mt-2 overflow-x-auto scrollbar-none">
          {/* Complete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateStatus(reminder.id, "completed");
              onDismiss(reminder.id);
            }}
            className="flex-shrink-0 w-auto whitespace-nowrap inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 active:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-md transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </button>

          {/* Dismiss */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateStatus(reminder.id, "dismissed");
              onDismiss(reminder.id);
            }}
            className="flex-shrink-0 w-auto whitespace-nowrap inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            Dismiss
          </button>

          {/* Contact */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewContact(reminder.contact_id);
            }}
            className="flex-shrink-0 w-auto whitespace-nowrap inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded-md transition-colors"
          >
            <Users className="h-4 w-4" />
            Contact
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
