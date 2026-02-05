import Header from "@/components/header";
import ContactForm from "@/components/contact-form";
import React from "react";
import { createClient } from "@/lib/supabase/server";

export default async function EditContactPage({params}: {params: {id: string}}) {
  const {id} = await params;
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
      <Header title="Edit Contact" subtitle="Editing an existing contact in your list" />
      <section>
        <ContactForm initialData={contactData} contactId={id}/>
      </section>
    </>
  );
}