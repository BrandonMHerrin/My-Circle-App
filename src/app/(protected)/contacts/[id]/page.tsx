import Header from "@/components/header";

export default async function NewContactPage() {
  return (
    <>
      <Header title="New Contact" subtitle="Add a new contact to your list" />
      {/* ===== NEW CONTACT FORM SECTION ===== */}
      <section>
        <p className="text-muted-foreground">This is where the new contact form will go.</p>
      </section>
    </>
  );
}