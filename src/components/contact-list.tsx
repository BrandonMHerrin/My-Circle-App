"use client";

import { ContactCard } from "./contact-card";
import { useRouter } from "next/navigation";
import { Tables } from "@/lib/supabase/database.types";

export function ContactList({ contacts }: { contacts: Tables<"contacts">[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      const response = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete contact.");
      }
    }
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onClick={(id) => router.push(`/contacts/${id}/edit`)}
          onEdit={(id) => router.push(`/contacts/${id}/edit`)}
          onDelete={handleDelete}
        />
      ))}
    </section>
  );
}
