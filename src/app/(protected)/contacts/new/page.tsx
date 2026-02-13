import Header from "@/components/shared/header";
import ContactForm from "@/components/contacts/contact-form";

export default async function NewContactPage() {
  return (
    <>
      <Header title="New Contact" subtitle="Add a new contact to your list" backHref="/contacts" />
      <section>
        <ContactForm />
      </section>
    </>
  );
}