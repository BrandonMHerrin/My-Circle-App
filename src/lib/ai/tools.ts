import { z } from "zod"
import {
  contactCreateSchema,
  contactsListQuerySchema,
} from "@/lib/validation/contact.schema"
import { interactionCreateSchema } from "@/lib/validation/interaction.schema"
import { reminderCreateSchema } from "@/lib/validation/reminder.schema"

export const tools = [
  {
    type: "function",
    function: {
      name: "create_contact",
      description: "Create a new contact",
      parameters: contactCreateSchema,
    },
  },
  {
    type: "function",
    function: {
      name: "list_contacts",
      description: "List contacts with optional filters",
      parameters: contactsListQuerySchema,
    },
  },
  {
    type: "function",
    function: {
      name: "log_interaction",
      description: "Log an interaction for a contact",
      parameters: interactionCreateSchema,
    },
  },
  {
    type: "function",
    function: {
      name: "create_reminder",
      description: "Create a reminder for a contact",
      parameters: reminderCreateSchema,
    },
  },
]
