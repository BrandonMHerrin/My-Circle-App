import Header from "@/components/shared/header";
import ContactForm from "@/components/contacts/contact-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewContactPage() {
  return (
    <>
      <Header
        title="New Contact"
        subtitle="Add a new contact to your list"
        backHref="/contacts"
        rightTop={
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl bg-white/70">
              Go to Dashboard
            </Button>
          </Link>
        }
      />

      {/* ❌ Quitamos StickerCard exterior */}
      <div className="mt-6">
        <ContactForm />
      </div>
    </>
  );
}
