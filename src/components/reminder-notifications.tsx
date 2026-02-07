"use client";

import { Tables } from "@/lib/supabase/database.types";
import { ReminderCard } from "./reminder-card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ReminderNotifications({
  initialReminders,
}: {
  initialReminders: Tables<"reminders">[];
}) {
  const [reminders, setReminders] = useState(initialReminders);

  const dismiss = (id: string) => {
    setReminders((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {reminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            layout
          >
            <ReminderCard
              reminder={reminder}
              onDismiss={dismiss}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
