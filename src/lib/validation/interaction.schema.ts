import { z } from "zod";

export const interactionTypeEnum = z.enum(["call", "meeting", "email", "text", "other"]);

export const interactionCreateSchema = z.object({
  contact_id: z.string().uuid(),
  interaction_date: z.string().min(10), // "YYYY-MM-DD"
  type: interactionTypeEnum,
  notes: z.string().min(1),
  location: z.string().max(100).nullable().optional(),
  duration_minutes: z.number().int().min(0).nullable().optional(),
});

export type InteractionCreateInput = z.infer<typeof interactionCreateSchema>;

export const interactionUpdateSchema = interactionCreateSchema.partial();
