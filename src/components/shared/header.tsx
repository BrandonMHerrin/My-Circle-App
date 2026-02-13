import Link from "next/link";
import { UserMenu } from "./user-menu";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string; // optional back link
}

export default function Header({
  title,
  subtitle,
  backHref,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        )}

        <h1 className="text-3xl font-semibold tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <UserMenu />
    </header>
  );
}
