// src/components/notebook/notebook-shell.tsx
import { NotebookSpiral } from "./notebook-spiral";

export function NotebookShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#9EC5FF] p-4 sm:p-8">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="h-full w-full [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Notebook outer shadow */}
        <div className="relative rounded-[32px] bg-[#2D2A7A] p-2 shadow-[0_30px_70px_rgba(0,0,0,0.30)]">
          {/* Paper area */}
          <div className="relative overflow-hidden rounded-[28px] bg-[#FFFEFB]">
            {/* Spiral */}
            <NotebookSpiral />

            {/* Paper top margin line */}
            <div className="pointer-events-none absolute left-0 top-10 h-[2px] w-full bg-[#FF6B6B]/60" />

            {/* Paper left margin */}
            <div className="pointer-events-none absolute left-[84px] top-0 h-full w-[2px] bg-[#FF6B6B]/30" />

            {/* Paper lines */}
            <div className="pointer-events-none absolute inset-0 opacity-55">
              <div className="h-full w-full [background-image:repeating-linear-gradient(to_bottom,rgba(15,23,42,0.08)_0px,rgba(15,23,42,0.08)_1px,transparent_1px,transparent_28px)]" />
            </div>

            {/* Content */}
            <div className="relative pl-[96px] pr-6 py-10 sm:pr-10">
              {children}
            </div>

            {/* Right side tabs */}
            <div className="pointer-events-none absolute right-0 top-24 hidden sm:flex flex-col gap-3 pr-2">
              <div className="h-10 w-8 rounded-l-xl bg-[#FFB703] shadow-md" />
              <div className="h-10 w-8 rounded-l-xl bg-[#8ECAE6] shadow-md" />
              <div className="h-10 w-8 rounded-l-xl bg-[#B8F2E6] shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
