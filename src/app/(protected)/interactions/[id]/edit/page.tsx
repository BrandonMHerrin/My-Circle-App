import Header from "@/components/shared/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { StickerCard } from "@/components/notebook/sticker-card";
import { CardContent } from "@/components/ui/card";

import EditInteraction from "@/components/interactions/edit-interaction";

export default async function EditInteractionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next 16 (sync dynamic APIs): params llega como Promise
  const { id } = await params;
  const safeId = String(id ?? "").trim();

  return (
    <>
      <Header
        title="Edit Interaction"
        subtitle="Update the interaction details"
        backHref="/interactions"
        rightTop={
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl bg-white/70">
              Go to Dashboard
            </Button>
          </Link>
        }
      />

      <StickerCard
        tone="sky"
        tiltIndex={2}
        className="mt-6 bg-sky-100/70 ring-1 ring-sky-200"
      >
        <CardContent className="mt-2">
          <div className="rounded-2xl bg-white/80 ring-1 ring-black/10 p-6 shadow-sm">
            <EditInteraction id={safeId} />
          </div>
        </CardContent>
      </StickerCard>
    </>
  );
}
