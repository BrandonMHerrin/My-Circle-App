"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle, CalendarCheck, Gift, X } from "lucide-react";
import { insightSchema } from "@/lib/validation/insight.schema";
import { z } from "zod";

type Insight = z.infer<typeof insightSchema>["insights"][number] ;


interface AIInsightCardProps {
  insight: Insight;
  onAction?: (insight: Insight) => void;
  onDismiss?: (insight: Insight) => void;
}

export function AIInsightCard({ insight, onAction, onDismiss }: AIInsightCardProps) {
  const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const actionIcons: Record<string, React.ReactNode> = {
    create_reminder: <Gift className="w-3 h-3" />,
    log_interaction: <CheckCircle className="w-3 h-3" />,
    none: <CalendarCheck className="w-3 h-3" />,
  };

  const isDismissable = insight.action_type !== "create_reminder";

  return (
    <Card className="w-full p-2 sm:p-3 rounded-md shadow-sm transition-all">
      <CardHeader className="flex justify-between items-center text-sm font-semibold truncate">
        <span className="truncate">{insight.contact_name}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded ${priorityColors[insight.priority]}`}
        >
          {insight.priority}
        </span>
        {isDismissable && onDismiss && (
            <button
              onClick={() => onDismiss(insight)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              title="Dismiss insight"
            >
              <X className="w-3 h-3" />
            </button>
          )}
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p className="truncate">{insight.message}</p>

        {insight.action_type === "create_reminder" && (
          <button
            onClick={() => onAction?.(insight)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <CheckCircle className="w-3 h-3" />
            Create Reminder
          </button>
        )}
      </CardContent>
    </Card>
  );
}