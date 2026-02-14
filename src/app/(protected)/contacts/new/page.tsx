
import Header from "@/components/shared/header";
import ContactForm from "@/components/contacts/contact-form";
import { StickerCard } from "@/components/notebook/sticker-card";
import { UserPlus } from "lucide-react";

export default async function NewContactPage() {
  return (
    <>
      <Header
        title="New Contact"
        subtitle="Add a new contact to your list"
        backHref="/contacts"
      />

      <section className="max-w-4xl">
        <StickerCard tone="lemon" tiltIndex={2} className="p-6">
          <div className="flex items-center gap-2 text-neutral-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-black/10">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Create New Contact</h2>
              <p className="text-sm text-neutral-700">
                Fill in the details below to add your contact in My Circle.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white/75 ring-1 ring-black/10 p-5">
            <ContactForm />
          </div>
        </StickerCard>
      </section>
    </>
  );
}
