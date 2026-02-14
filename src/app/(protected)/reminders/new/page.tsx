
import Header from "@/components/shared/header";
import ContactForm from "@/components/contacts/contact-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewContactPage() {
  return (
    <>
      <Header
        title="New Contact"
        subtitle="Add a new contact to your list"
        backHref="/contacts"
      />

      <div className="flex justify-end mb-4">
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-xl">
            Go to Dashboard
          </Button>
        </Link>
      </div>

      <section>
        <ContactForm />
      </section>
    </>
  );
}
