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

export const interactionsListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
  type: interactionTypeEnum.optional(),
  contact_id: z.string().uuid().optional(),
  start: z.string().datetime({ offset: true }).optional(),
  end: z.string().datetime({ offset: true }).optional(),
});

export const interactionsListQuerySchemaAI = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
  type: interactionTypeEnum.optional(),
  contact_id: z.string().uuid().optional(),
  start: z.string().datetime({ offset: true }).optional(),
  end: z.string().datetime({ offset: true }).optional(),
});
