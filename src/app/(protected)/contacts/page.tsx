
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

      <StickerCard tone="lemon" tiltIndex={1} className="p-5">
        <div className="rounded-2xl bg-white/70 ring-1 ring-black/10 p-5">
          {contactList.length === 0 ? (
            <p className="text-sm text-neutral-700">
              No contacts found. Start by adding a new contact!
            </p>
          ) : (
            <ContactList contacts={contactList} />
          )}
        </div>
      </StickerCard>
    </>
  );
}
