import Header from "@/components/shared/header";
import InteractionList from "@/components/interactions/interaction-list";

export default function InteractionsPage() {
  return (
    <>
      <Header title="Interacciones" subtitle="Historia de tus interacciones" />
      <section className="space-y-4">
        <InteractionList />
      </section>
    </>
  );
}
