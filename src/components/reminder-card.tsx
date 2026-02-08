"use client";

import { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { parseISO, format, isToday, isThisWeek, startOfDay, isAfter } from "date-fns";
import { Users, CalendarClock, CalendarCheck, Gift, Heart, PhoneCall, Star, IdCard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface ReminderCardProps {
  reminder: Tables<"reminders">;
  onDismiss: (id: string) => void;
}

export function ReminderCard({
  reminder,
  onDismiss
}: ReminderCardProps) {
  const reminderDate = reminder.reminder_date ? parseISO(reminder.reminder_date) : null;
  const router = useRouter();
  // Icon mapping for badges
  const reminderTypeIcons: Record<string, React.ReactNode> = {
    birthday: <Gift className="w-4 h-4" />,
    anniversary: <Heart className="w-4 h-4" />,
    follow_up: <PhoneCall className="w-4 h-4" />,
    custom: <Star className="w-4 h-4" />
  };
  // Color mapping for icon badges
  const reminderTypeColors: Record<string, string> = {
    birthday: "bg-pink-100 text-pink-700",
    anniversary: "bg-red-100 text-red-700",
    follow_up: "bg-blue-100 text-blue-700",
    custom: "bg-gray-100 text-gray-700"
  };
  // Color mapping for urgency types
  const urgencyColors: Record<string, string> = {
    today: "bg-red-100 text-red-800",
    week: "bg-orange-100 text-orange-800",
    upcoming: "bg-blue-100 text-blue-800",
    past: "bg-gray-100 text-gray-600"
  };

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
    console.log("View contact", id);
    router.push(`/contacts/${id}`);
    router.refresh();
  }

  async function handleSnooze(id: string, snoozeDate: Date) {
    try {
        const res = await fetch(`/api/reminders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ reminder_date: format(snoozeDate, "yyyy-MM-dd") }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to snooze reminder");
      }
    } catch (err: any) {
      alert("Failed to snooze reminder");
    } finally {
      reminder.reminder_date = snoozeDate.toISOString();
      setIsSnoozing(false);
      setSnoozeDate(null);
    }
  }

  async function handleDismiss(id: string) {
    try {
        const res = await fetch(`/api/reminders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ reminder_status: "dismissed"}),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to dismiss reminder");
      }
    } catch (err: any) {
      console.log("Failed to dismiss reminder");
    } finally {
      setIsSnoozing(false);
      setSnoozeDate(null);
    }
  }


  const getUrgencyColor = (reminderDate: string) => {
    if (!reminderDate) return "bg-gray-100 text-gray-600"; // default color if reminder_date is undefined
    return urgencyColors[getDateUrgency(reminderDate)] || "bg-gray-100 text-gray-800";
  }

  const [isSnoozing, setIsSnoozing] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState<Date | null>(null);

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

        {/* Reminder Type Text */}
        {reminder.reminder_type.replace("_", " ").toUpperCase()}
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
        

        {/* Action buttons */}
        <div className="w-full flex flex-row flex-nowrap gap-1 mt-2 overflow-x-auto scrollbar-none">
          {/* Dismiss */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss(reminder.id);
              onDismiss(reminder.id);
            }}
            className="flex-shrink-0 w-auto whitespace-nowrap inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            Dismiss
          </button>

          {/* Snooze */}
          <Popover open={isSnoozing} onOpenChange={setIsSnoozing}>
            <PopoverTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex-shrink-0 w-auto whitespace-nowrap inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md transition-colors"
              >
                <CalendarClock className="h-4 w-4" />
                Snooze
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="w-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar
                mode="single"
                selected={snoozeDate ?? undefined}
                onSelect={(date) => {
                  if (!date) return;
                  setSnoozeDate(date);
                  setIsSnoozing(false);
                  handleSnooze(reminder.id, date);
                  onDismiss(reminder.id);
                }}
                initialFocus
              />
              {snoozeDate && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Snoozed until {format(snoozeDate, "PPP")}
                </p>
              )}
            </PopoverContent>
          </Popover>

          {/* Contact */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewContact(reminder.id);
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
