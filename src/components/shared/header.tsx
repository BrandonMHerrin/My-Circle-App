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
    <div className="relative mb-6">
      {/* ✅ esquina superior derecha */}
      {rightTop ? (
        <div className="absolute right-0 top-0 flex items-center justify-end">
          {rightTop}
        </div>
      ) : null}

      {/* línea roja */}
      <div className="absolute -top-4 left-0">
        <div className="h-[3px] w-28 rounded-full bg-red-500" />
      </div>

      {/* back */}
      {backHref ? (
        <div className="mb-2">
          <Button asChild variant="ghost" className="gap-2 px-0">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      ) : null}

      {/* padding-right para que no choque con rightTop */}
      <div className="pt-1 pr-44">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm sm:text-base text-neutral-600">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
