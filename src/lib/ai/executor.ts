import { z } from "zod"
import {
  contactCreateSchema,
  contactsListQuerySchema,
} from "@/lib/validation/contact.schema"
import { interactionCreateSchema } from "@/lib/validation/interaction.schema"
import { reminderCreateSchema } from "@/lib/validation/reminder.schema"
import { SupabaseClient } from "@supabase/supabase-js"

export async function executeTool(
  name: string,
  args: unknown,
  userId: string,
  supabase: SupabaseClient
) {
  switch (name) {
    case "create_contact": {
      const parsed = contactCreateSchema.parse(args)
      const { data, error } = await supabase
        .from("contacts")
        .insert({ ...parsed, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return { success: true, contact: data }
    }

    case "list_contacts": {
      const parsed = contactsListQuerySchema.parse(args)
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId)
        .range(parsed.offset, parsed.offset + parsed.limit - 1)
      if (error) throw error
      return { success: true, contacts: data }
    }

    case "log_interaction": {
      const parsed = interactionCreateSchema.parse(args)
      const { data, error } = await supabase
        .from("interactions")
        .insert({ ...parsed, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return { success: true, interaction: data }
    }

    case "create_reminder": {
      const parsed = reminderCreateSchema.parse(args)
      const { data, error } = await supabase
        .from("reminders")
        .insert({ ...parsed, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return { success: true, reminder: data }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}
