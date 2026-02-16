import Header from "@/components/shared/header";
import LogInteraction from "@/components/interactions/log-interaction";
import { StickerCard } from "@/components/notebook/sticker-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewInteractionPage() {
  return (
    <>
      <Header
        title="New Interaction"
        subtitle="Record a new interaction with a contact"
        backHref="/dashboard"
        rightTop={
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl bg-white/70">
              Go to Dashboard
            </Button>
          </Link>
        }
      />

      <section className="max-w-5xl">
        <StickerCard tone="sky" tiltIndex={2} className="p-4 sm:p-6">
          <LogInteraction redirectTo="/dashboard" />
        </StickerCard>
      </section>
    </>
  );
}
