// src/components/shared/header.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  rightTop?: React.ReactNode; // ✅ nuevo
};

export default function Header({ title, subtitle, backHref, rightTop }: HeaderProps) {
  return (
    <div className="relative mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      {/* línea roja */}
      <div className="absolute -top-4 left-0">
        <div className="h-[3px] w-28 rounded-full bg-red-500" />
      </div>

      <div className="space-y-1 max-w-2xl">
        {/* back */}
        {backHref ? (
          <div className="mb-2">
            <Button asChild variant="ghost" className="gap-2 px-0 h-auto py-1 hover:bg-transparent -ml-1">
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        ) : null}

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-base sm:text-lg text-neutral-600 font-medium">{subtitle}</p>
        ) : null}
      </div>

      {/* rightTop */}
      {rightTop ? (
        <div className="flex items-center sm:justify-end">
          {rightTop}
        </div>
      ) : null}
    </div>
  );
}
