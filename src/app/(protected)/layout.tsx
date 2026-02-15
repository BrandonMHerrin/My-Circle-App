"use client";

import { useState } from "react";
import AssistantChat from "@/components/assistant/assistant-chat";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);

  return (
    <>
      <div className="relative min-h-screen bg-background">
        {/* Centered content container with max width */}
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
          {children}
        </div>

        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence mode="wait">
            {isAssistantOpen ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <AssistantChat onClose={() => setIsAssistantOpen(false)} />
              </motion.div>
            ) : (
              <motion.button
                key="open-button"
                onClick={() => setIsAssistantOpen(true)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full border-2 border-neutral-900 bg-[#2D2A7A] px-6 py-3 font-bold text-white shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                <Sparkles size={18} />
                Ask Assistant
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
