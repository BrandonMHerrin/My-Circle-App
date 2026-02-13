import { z } from "zod";

export const insightSchema = z.object({
  insights: z.array(
    z.object({
      // The ai generated text recommendation or insight
      message: z.string(),

      // How urgent the insight is (used for sorting and display purposes)
      priority: z.enum(["low", "medium", "high"]),

      // What the user can do about it:
      //    "create_reminder" - the insight is a recommendation to create a reminder for a specific contact and date
      //    "log_interaction" - the insight is a recommendation to log an interaction for a specific contact
      //    "none" - information only insight with no specific action recommended
      action_type: z.enum(["create_reminder", "log_interaction", "none"]),

      // Which contact this insight is related to
      contact_name: z.string(),

      // Optional structured data for the 
      payload: z.object({
        contact_id: z.uuid(),
        reminder_type: z.enum(["birthday", "follow_up", "custom", "anniversary"]).optional(),
        reminder_date: z.string().optional(), 
        message: z.string().optional(),
      }).optional(),
    })
  ),
});
