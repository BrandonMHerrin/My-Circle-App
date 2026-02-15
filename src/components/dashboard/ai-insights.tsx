"use client";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { insightSchema } from "@/lib/validation/insight.schema";
import { z } from "zod";
import { AIInsightCard } from "../shared/ai-insight-card";
import { Router } from "next/router";

type Insight = z.infer<typeof insightSchema>["insights"][number];

export function AISugestions() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [insights, setInsights] = useState<Insight[]>([]);

    async function generateInsights() {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/ai/insights", {
                credentials: "include",
            });

            if (!res.ok) {
                console.log(res);
                const txt = await res.text().catch(() => "");
                throw new Error(txt || "Failed to load AI insights");
            }
            const data = await res.json();
            setInsights(data.insights ?? []);
        } catch (error: any) {
            setError(error.message ?? "Something went wrong loading AI insights");
        } finally {
            setLoading(false);
        }

    }

    async function handleInsightAction(insight: Insight) {
        try {
            if (!insight.payload?.contact_id) return;
            if (insight.action_type === "create_reminder") {
                // Call your API to create a reminder
                const res = await fetch("/api/reminders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        contact_id: insight.payload.contact_id,
                        reminder_type: insight.payload.reminder_type ?? "custom",
                        reminder_date: insight.payload.reminder_date ?? new Date().toISOString(),
                        message: insight.payload.action_message ?? insight.message,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error?.message ?? "Failed to create reminder");
                }

                alert(`Reminder created for ${insight.contact_name}`);
            } else if (insight.action_type === "log_interaction") {
                console.log("to be implemented");
            }
            setInsights((prev) => prev.filter((i: Insight) => i !== insight));

        } catch (error: any) {
            alert(error.message ?? "Something went wrong loading AI insights");
        }
    }
    useEffect(() => {
        generateInsights();
    }, []);

    if (loading) return <p>Loading your AI Insights...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-4">
            {insights && (insights.map((insight, idx) => {
                return (
                    <AIInsightCard
                        key={idx}
                        insight={insight}
                        onAction={async (ins) => await handleInsightAction(ins)}
                        onDismiss={(ins) => setInsights((prev) => prev.filter((i) => i !== ins))}
                    />
                );
            }))}
        </div>
    );
}