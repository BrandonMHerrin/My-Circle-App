
import Header from "@/components/shared/header";
import InteractionList from "@/components/interactions/interaction-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StickerCard } from "@/components/notebook/sticker-card";

export default function InteractionsPage() {
  return (
    <>
      <Header
        title="Interactions"
        subtitle="Manage your interactions with contacts"
        backHref="/dashboard"
      />

      <div className="mb-4">
        <Button
          asChild
          className="rounded-xl bg-[#2D2A7A] text-white hover:bg-[#231f63] gap-2"
        >
          <Link href="/interactions/new">
            <Plus className="size-4" />
            Log Interaction
          </Link>
        </Button>
      </div>

      <section className="space-y-4">
        {/* Contenedor tipo sticker, como dashboard */}
        <StickerCard tone="sky" tiltIndex={3} className="p-6">
          <div className="rounded-2xl bg-white/75 ring-1 ring-black/10 p-5">
            <InteractionList />
          </div>
        </StickerCard>
      </section>
    </>
  );
}
