"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";

export default function EditContactPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContact() {
      const res = await fetch(`/api/contacts/${id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        alert("Failed to load contact");
        router.push("/dashboard");
        return;
      }

      const json = await res.json();
      setContact(json.data);
      setLoading(false);
    }

    loadContact();
  }, [id, router]);

  async function handleDelete() {
    const ok = confirm(
      "Are you sure you want to delete this contact? This action cannot be undone."
    );
    if (!ok) return;

    const res = await fetch(`/api/contacts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Failed to delete contact");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6">
      <ContactForm initialData={contact} contactId={id} />

      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleDelete}>
          Delete Contact
        </Button>
      </div>
    </div>
  );
}
