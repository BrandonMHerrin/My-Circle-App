import Header from "@/components/header";
import EditInteraction from "@/components/edit-interaction";

export default async function EditInteractionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header title="Edit Interaction" subtitle="Update your interaction details" />
      <section className="space-y-4">
        <EditInteraction id={id} />
      </section>
    </>
  );
}
