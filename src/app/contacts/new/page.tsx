import { type Metadata } from 'next';
import ContactForm from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "New contact - My Circle App",
}

export default async function NewContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageHeader
          title="New Contact"
          description="Add a new person to your network"
        />

        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}