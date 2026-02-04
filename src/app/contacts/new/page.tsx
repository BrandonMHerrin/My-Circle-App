import { type Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "New contact - My Circle App",
};

export default function NewContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <ContactForm />
    </div>
  );
}
