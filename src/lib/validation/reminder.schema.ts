import { z } from "zod";

export const reminderStatusEnum = z.enum([
	"active",
	"dismissed",
	"completed",
]);
export const reminderTypeEnum = z.enum([
	"birthday",
	"follow_up",
	"custom",
	"anniversary",
]);

export const reminderIdSchema = z.string().uuid();

export const reminderCreateSchema = z.object({
	contact_id: z.string().uuid(),
	reminder_type: reminderTypeEnum.default("custom"),
	message: z.string().max(2000).optional().nullable(),
	reminder_date: z.string().datetime({ offset: true }), // ISO datetime with timezone offset (timestamptz)
});

export const reminderPatchSchema = z.object({
	status: reminderStatusEnum.optional(),
	reminder_date: z.string().datetime({ offset: true }).optional(),
	message: z.string().max(2000).optional().nullable(),
});

export const remindersListQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(25),
	offset: z.coerce.number().int().min(0).default(0),

	// filtering
	status: reminderStatusEnum.optional(), // active/dismissed/completed
	type: reminderTypeEnum.optional(),
	contact_id: z.string().uuid().optional(),

	// date range: reminder_date
	start: z.string().datetime({ offset: true }).optional(),
	end: z.string().datetime({ offset: true }).optional(),

	// sorting
	sort: z.enum(["reminder_date", "created_at"]).default("reminder_date"),
	order: z.enum(["asc", "desc"]).default("asc"),

	// "upcoming/active" convenience
	upcoming: z.coerce.boolean().optional(), // if true, only reminders due >= now and not dismissed/completed
});
