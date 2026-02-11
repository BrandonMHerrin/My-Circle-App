"use client";

import { Tables } from "@/lib/supabase/database.types";
import { ReminderCard } from "./reminder-card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  reminder: Tables<"reminders">;
}

export function ReminderCardWrapper({ reminder }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const dismiss = (id: string) => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={reminder.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ReminderCard
            reminder={reminder}
            onDismiss={dismiss}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}