import Header from "@/components/header";
import LogInteraction from "@/components/log-interaction";

export default function NewInteractionPage() {
  return (
    <>
      <Header title="Log Interaction" subtitle="Record a new interaction with a contact" />
      <section className="space-y-4">
        <LogInteraction />
      </section>
    </>
  );
}
