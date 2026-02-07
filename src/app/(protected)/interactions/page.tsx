import Header from "@/components/header";
import InteractionList from "@/components/interaction-list";

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
