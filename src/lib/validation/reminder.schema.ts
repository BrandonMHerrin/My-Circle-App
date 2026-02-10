import { z } from "zod";

export const reminderStatusEnum = z.enum([
	"active",
	"snoozed",
	"dismissed",
	"completed",
]);
export const reminderTypeEnum = z.enum([
	"birthday",
	"follow_up",
	"custom",
	"anniversary",
	"other",
]);

export const reminderIdSchema = z.string().uuid();

export const reminderCreateSchema = z.object({
	contact_id: z.string().uuid().optional().nullable(),
	type: reminderTypeEnum.default("custom"),
	title: z.string().min(1).max(200),
	message: z.string().max(2000).optional().nullable(),
	remind_at: z.string().datetime({ offset: true }), // ISO datetime with timezone offset (timestamptz)
});

export const reminderPatchSchema = z.object({
	// You said "update status: dismiss/snooze" so we support both,
	// but also allow other safe partial updates in case you want it.
	status: reminderStatusEnum.optional(),
	snoozed_until: z.string().datetime({ offset: true }).optional().nullable(),
	remind_at: z.string().datetime({ offset: true }).optional(),
	title: z.string().min(1).max(200).optional(),
	message: z.string().max(2000).optional().nullable(),
});

export const remindersListQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(25),
	offset: z.coerce.number().int().min(0).default(0),

	// filtering
	status: reminderStatusEnum.optional(), // active/snoozed/dismissed/completed
	type: reminderTypeEnum.optional(),
	contact_id: z.string().uuid().optional(),

	// date range: remind_at
	start: z.string().datetime({ offset: true }).optional(),
	end: z.string().datetime({ offset: true }).optional(),

	// sorting
	sort: z.enum(["remind_at", "created_at"]).default("remind_at"),
	order: z.enum(["asc", "desc"]).default("asc"),

	// "upcoming/active" convenience
	upcoming: z.coerce.boolean().optional(), // if true, only reminders due >= now and not dismissed/completed
});
