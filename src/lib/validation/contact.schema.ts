import { z } from "zod";

export const relationshipTypeEnum = z.enum([
	"family",
	"friend",
	"colleague",
	"acquaintance",
	"other",
]);

export const contactCreateSchema = z.object({
	fname: z.string().min(1).max(100),
	lname: z.string().min(1).max(100),
	email: z.string().email().optional().nullable(),
	phone: z.string().max(50).optional().nullable(),
	relationship: relationshipTypeEnum.optional().nullable(),
	dob: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "birthday must be YYYY-MM-DD")
		.optional()
		.nullable(),
	notes: z.string().optional().nullable(),
});

export const contactUpdateSchema = contactCreateSchema.partial();
export const contactIdSchema = z.string().uuid();

export const contactsListQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(25),
	offset: z.coerce.number().int().min(0).default(0),
	search: z.string().trim().optional(),
	relationship: relationshipTypeEnum.optional(),
});

export const contactsListQuerySchemaAI = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
	search: z.string().optional(),
	relationship: relationshipTypeEnum.optional(),
});
