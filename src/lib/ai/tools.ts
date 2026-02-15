import { tool } from "ai";
import { z } from "zod";
import {
  contactCreateSchema,
  contactsListQuerySchemaAI,
} from "@/lib/validation/contact.schema";
import { interactionCreateSchema, interactionsListQuerySchemaAI } from "@/lib/validation/interaction.schema";
import { reminderCreateSchemaAI, remindersListQuerySchemaAI } from "@/lib/validation/reminder.schema";
import { executeTool } from "./executor";
import { SupabaseClient } from "@supabase/supabase-js";

export const getTools = (supabase: SupabaseClient, userId: string) => ({
  create_contact: tool({
    description: "Create a new contact",
    inputSchema: contactCreateSchema,
    execute: async (input) => executeTool("create_contact", input, userId, supabase),
  }),
  list_contacts: tool({
    description: "List contacts with optional filters",
    inputSchema: contactsListQuerySchemaAI,
    execute: async (input) => executeTool("list_contacts", input, userId, supabase),
  }),
  log_interaction: tool({
    description: "Log an interaction for a contact",
    inputSchema: interactionCreateSchema,
    execute: async (input) => executeTool("log_interaction", input, userId, supabase),
  }),
  list_interactions: tool({
    description: "List interactions with optional filters like contact_id or date range.",
    inputSchema: interactionsListQuerySchemaAI,
    execute: async (input) => executeTool("list_interactions", input, userId, supabase),
  }),
  create_reminder: tool({
    description: "Create a reminder for a contact",
    inputSchema: reminderCreateSchemaAI,
    execute: async (input) => executeTool("create_reminder", input, userId, supabase),
  }),
  list_reminders: tool({
    description: "List reminders with optional filters. Use the filters informed by the user, or fetch all reminders if no filters are provided.",
    inputSchema: remindersListQuerySchemaAI,
    execute: async (input) => executeTool("list_reminders", input, userId, supabase),
  }),
  get_contact_insights: tool({
    description: "Get full context for a contact (profile, recent interactions, and upcoming reminders) to provide relationship advice or activity suggestions.",
    inputSchema: z.object({
      contact_id: z.string().uuid().describe("The ID of the contact to get insights for"),
    }),
    execute: async (input) => executeTool("get_contact_insights", input, userId, supabase),
  }),
});





