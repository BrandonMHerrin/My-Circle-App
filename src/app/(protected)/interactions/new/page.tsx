
import Header from "@/components/shared/header";
import LogInteraction from "@/components/interactions/log-interaction";
import { StickerCard } from "@/components/notebook/sticker-card";

export default function NewInteractionPage() {
  return (
    <>
      <Header
        title="New Interaction"
        subtitle="Record a new interaction with a contact"
        backHref="/dashboard"
      />

      <section className="max-w-5xl">
        {/* ✅ Igual estilo que Interaction History: sticker azul + panel blanco */}
        <StickerCard tone="sky" tiltIndex={2} className="p-6">
          <div className="rounded-2xl bg-white/75 ring-1 ring-black/10 p-5">
            <LogInteraction redirectTo="/dashboard" />
          </div>
        </StickerCard>
      </section>
    </>
  );
}
