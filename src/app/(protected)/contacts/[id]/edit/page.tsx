import Header from "@/components/shared/header";
import ContactForm from "@/components/contacts/contact-form";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { StickerCard } from "@/components/notebook/sticker-card";

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contactData, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Failed to load dashboard data");
  }

  return (
    <>
      <Header title="Edit Contact" subtitle="Editing an existing contact in your list" backHref="/contacts" />
      <section className="mt-6">
        <StickerCard tone="lemon" tiltIndex={3} className="p-4 sm:p-6">
          <ContactForm initialData={contactData} contactId={id} />
        </StickerCard>
      </section>
    </>
  );
}