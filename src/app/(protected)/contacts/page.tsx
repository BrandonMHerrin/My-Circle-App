import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
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
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactList.map((contact) => (
              <Card key={contact.id} className="p-4">
                <h2 className="text-lg font-semibold">{contact.name}</h2>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              </Card>
            ))}
          </section>
        )}
    </>
  );
}