
import { ContactList } from "@/components/contacts/contact-list";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StickerCard } from "@/components/notebook/sticker-card";

export default async function ContactsPage() {
  const supabase = await createClient();

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to load contacts");

  const contactList = contacts ?? [];

  return (
    <>
      <Header
        title="Contacts"
        subtitle="Manage your contacts and their details"
        backHref="/dashboard"
      />

      <div className="flex items-center justify-between gap-3 mb-4">
        <Link href="/contacts/new">
          <Button className="rounded-xl bg-[#2D2A7A] text-white hover:bg-[#231f63] gap-2">
            <Plus className="size-4" />
            Add Contact
          </Button>
        </Link>
      </div>

      <StickerCard tone="lemon" tiltIndex={1} className="p-4 sm:p-6">
        {contactList.length === 0 ? (
          <div className="text-center py-10 bg-white/50 rounded-xl">
            <p className="text-neutral-600">
              No contacts found. Start by adding a new contact!
            </p>
          </div>
        ) : (
          <ContactList contacts={contactList} />
        )}
      </StickerCard>
    </>
  );
}
