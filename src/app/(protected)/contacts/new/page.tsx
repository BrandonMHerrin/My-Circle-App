import Header from "@/components/header";
import ContactForm from "@/components/contact-form";

export default async function NewContactPage() {
  return (
    <>
      <Header title="New Contact" subtitle="Add a new contact to your list" />
      <section>
        <ContactForm />
      </section>
    </>
  );
}