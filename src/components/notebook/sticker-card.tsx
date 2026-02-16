// src/components/notebook/sticker-card.tsx
import { Card } from "@/components/ui/card";

type StickerTone =
  | "lemon"
  | "sky"
  | "mint"
  | "peach"
  | "paper"
  | "rose"
  | "grape"
  | "orange";

const toneStyles: Record<StickerTone, string> = {
  paper: "bg-white border-neutral-200",
  lemon: "bg-[#FFF2B2] border-[#F3D97A]",
  sky: "bg-[#CFE8FF] border-[#9CCBFF]",
  mint: "bg-[#CFF5E7] border-[#98E6D0]",
  peach: "bg-[#FFD6C8] border-[#FFB59E]",
  rose: "bg-[#FFD1D8] border-[#FF9FB0]",
  grape: "bg-[#E6D7FF] border-[#C6A9FF]",
  orange: "bg-[#FFD08A] border-[#FFB14D]",
};

const tiltStyles = [
  "rotate-[0.4deg]",
  "-rotate-[0.6deg]",
  "rotate-[0deg]",
  "rotate-[0.8deg]",
  "-rotate-[0.3deg]",
];

export function StickerCard({
  tone = "paper",
  tiltIndex = 2,
  className = "",
  children,
}: {
  tone?: StickerTone;
  tiltIndex?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const tilt = tiltStyles[tiltIndex % tiltStyles.length];

  return (
    <Card
      className={[
        "relative rounded-2xl border",
        toneStyles[tone],
        tilt,
        "shadow-[0_18px_30px_rgba(0,0,0,0.18)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_26px_45px_rgba(0,0,0,0.22)] hover:rotate-[0deg]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -top-3 left-10 h-6 w-16 rotate-[-8deg] rounded-md bg-white/55 shadow-sm backdrop-blur-[1px]" />
      {children}
    </Card>
  );
}
