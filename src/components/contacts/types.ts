export type ContactFormValues = {
  fname: string
  lname: string
  email?: string | null
  phone?: string | null
  relationship: string
  dob?: string | null // YYYY-MM-DD
  notes?: string | null
}

export type ContactFormMode = "create" | "edit"
