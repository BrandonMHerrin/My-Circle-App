import { ContactCard } from "@/components/contact-card";
import { ContactList } from "@/components/contact-list";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Contact, Plus } from "lucide-react";
import Link from "next/link";

export default async function ContactsPage() {
  const supabase = await createClient();

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load contacts");
  }

  const contactList = contacts ?? [];
  
  return (
    <>
        <Header title="Contacts" subtitle="Manage your contacts and their details" />
        {/* Add Contact Button */}
        <Link href="/contacts/new" className="mb-4 inline-block">
          <Button>
            <Plus className="size-4" />
            Add Contact
          </Button>
        </Link>
        {/* Responsive contacts grid layout */}
        {contactList.length === 0 ? (
          <p className="text-muted-foreground">No contacts found. Start by adding a new contact!</p>
        ) : (
          <ContactList contacts={contactList} />
        )}
    </>
  );
}