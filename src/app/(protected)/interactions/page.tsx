import Header from "@/components/shared/header";
import InteractionList from "@/components/interactions/interaction-list";

export default function InteractionsPage() {
  return (
    <>
      <Header title="Interactions" subtitle="Manage your interactions with contacts" backHref="/dashboard" />
      <section className="space-y-4">
        <InteractionList />
      </section>
    </>
  );
}
