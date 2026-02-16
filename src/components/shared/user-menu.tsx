// src/components/shared/user-menu.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/session-provider";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="h-9 w-44 animate-pulse rounded-xl bg-neutral-200" />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-neutral-600 sm:inline">
        Welcome, <span className="font-medium text-neutral-900">
          {user?.user_metadata.full_name || "User"}
        </span>
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={signOut}
        disabled={loading}
        className="rounded-xl border-neutral-300 bg-white hover:bg-neutral-50"
      >
        {loading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
