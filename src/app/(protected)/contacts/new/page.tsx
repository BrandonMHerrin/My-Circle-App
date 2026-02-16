import Header from "@/components/shared/header";
import ContactForm from "@/components/contacts/contact-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StickerCard } from "@/components/notebook/sticker-card";

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

      {/* ✅ StickerCard wrapper added after removing it from the form */}
      <div className="mt-6">
        <StickerCard tone="lemon" tiltIndex={2} className="p-4 sm:p-6">
          <ContactForm />
        </StickerCard>
      </div>
    </>
  );
}
