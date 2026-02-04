"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/session-provider";

/**
 * UserMenu
 *
 * Displays the current user's name and a sign-out button.
 * Consumes auth state from SessionProvider via useAuth hook.
 *
 * Must be rendered within a SessionProvider context.
 *
 * @example
 * <Header title="Dashboard">
 *   <UserMenu />
 * </Header>
 */
export function UserMenu() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        Welcome, {user?.user_metadata.full_name || "User"}
      </span>
      <Button variant="outline" size="sm" onClick={signOut} disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
