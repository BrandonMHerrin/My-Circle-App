// src/components/notebook/notebook-spiral.tsx
export function NotebookSpiral() {
  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-[84px] bg-[#2D2A7A]">
      <div className="absolute inset-y-0 left-0 w-[16px] bg-[#221f66]" />

      {/* Rings */}
      <div className="flex h-full flex-col items-center justify-start gap-5 py-10">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="relative">
            {/* Outer ring */}
            <div className="h-6 w-6 rounded-full bg-white/90 shadow-[0_6px_10px_rgba(0,0,0,0.25)]" />
            {/* Inner hole */}
            <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2D2A7A]" />
          </div>
        ))}
      </div>
    </div>
  );
}
