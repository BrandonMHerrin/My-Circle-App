import { z } from "zod"
import {
  contactCreateSchema,
  contactsListQuerySchema,
} from "@/lib/validation/contact.schema"
import { interactionCreateSchema, interactionsListQuerySchema } from "@/lib/validation/interaction.schema"
import { reminderCreateSchema, remindersListQuerySchema } from "@/lib/validation/reminder.schema"
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
      const { data, count, error } = await supabase
        .from("contacts")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .range(parsed.offset, parsed.offset + parsed.limit - 1)
      if (error) throw error
      return { success: true, contacts: data, count }
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

    case "list_reminders": {
      const parsed = remindersListQuerySchema.parse(args);
      let query = supabase
        .from("reminders")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      if (parsed.status) query = query.eq("status", parsed.status);
      if (parsed.type) query = query.eq("reminder_type", parsed.type);
      if (parsed.contact_id) query = query.eq("contact_id", parsed.contact_id);

      if (parsed.start) query = query.gte("reminder_date", parsed.start);
      if (parsed.end) query = query.lte("reminder_date", parsed.end);

      if (parsed.upcoming) {
        query = query
          .gte("reminder_date", new Date().toISOString())
          .neq("status", "completed")
          .neq("status", "dismissed");
      }

      const { data, count, error } = await query
        .order(parsed.sort, { ascending: parsed.order === "asc" })
        .range(parsed.offset, parsed.offset + parsed.limit - 1);

      if (error) throw error;
      return { success: true, reminders: data, count };
    }

    case "list_interactions": {
      const parsed = interactionsListQuerySchema.parse(args);
      let query = supabase
        .from("interactions")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      if (parsed.type) query = query.eq("type", parsed.type);
      if (parsed.contact_id) query = query.eq("contact_id", parsed.contact_id);
      if (parsed.start) query = query.gte("interaction_date", parsed.start);
      if (parsed.end) query = query.lte("interaction_date", parsed.end);

      const { data, count, error } = await query
        .order("interaction_date", { ascending: false })
        .range(parsed.offset, parsed.offset + parsed.limit - 1);

      if (error) throw error;
      return { success: true, interactions: data, count };
    }

    case "get_contact_insights": {
      const { contact_id } = z.object({ contact_id: z.string().uuid() }).parse(args);

      // 1. Fetch Contact Details
      const contactPromise = supabase
        .from("contacts")
        .select("*")
        .eq("id", contact_id)
        .eq("user_id", userId)
        .single();

      // 2. Fetch Recent Interactions (last 10)
      const interactionsPromise = supabase
        .from("interactions")
        .select("*")
        .eq("contact_id", contact_id)
        .eq("user_id", userId)
        .order("interaction_date", { ascending: false })
        .limit(10);

      // 3. Fetch Upcoming Reminders
      const remindersPromise = supabase
        .from("reminders")
        .select("*")
        .eq("contact_id", contact_id)
        .eq("user_id", userId)
        .gte("reminder_date", new Date().toISOString())
        .neq("status", "completed")
        .neq("status", "dismissed");

      const [contactRes, interactionsRes, remindersRes] = await Promise.all([
        contactPromise,
        interactionsPromise,
        remindersPromise
      ]);

      if (contactRes.error) throw contactRes.error;

      return {
        success: true,
        contact: contactRes.data,
        recent_interactions: interactionsRes.data || [],
        upcoming_reminders: remindersRes.data || []
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}
