import { z } from "zod";

export const insightSchema = z.object({
  insights: z.array(
    z.object({
      message: z.string(),
      priority: z.enum(["low", "medium", "high"]),
      action_type: z.enum(["create_reminder", "log_interaction", "none"]),
      contact_name: z.string(),

      // payload ALWAYS exists
      payload: z.object({
        contact_id: z.string().uuid(),
        reminder_type: z.enum([
          "birthday",
          "follow_up",
          "custom",
          "anniversary"
        ]),
        reminder_date: z.string(),
        action_message: z.string(),
      }),
    })
  ),
});
