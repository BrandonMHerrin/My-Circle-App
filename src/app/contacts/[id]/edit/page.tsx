import { type Metadata } from 'next';
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ContactForm from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Edit contact - My Circle App",
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditContactPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  const { data: contact, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !contact) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageHeader
          title="Edit Contact"
          description={`Updating details for ${contact.fname} ${contact.lname}`}
        />

        <div className="mx-auto max-w-2xl">
          <ContactForm initialData={contact} contactId={id} />
        </div>
      </div>
    </div>
  );
}