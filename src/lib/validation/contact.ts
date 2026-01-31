import {z} from "zod";

export const contactSchema = z.object({
    fname: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
    lname: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
    email: z
    .string()
    .email("Invalid email address"),
    phone: z
    .string()
    .optional(),
    relationship: z
    .string()
    .min(1, "Relationship is required"),
    dob: z
    .string()
    .optional(),
    notes: z
    .string()
    .optional()
});
export type ContactInput = z.infer<typeof contactSchema>;