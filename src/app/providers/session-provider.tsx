"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Shape of the authentication context provided to consumers.
 */
type AuthContextType = {
  /** The currently authenticated user, or null if not logged in */
  user: User | null;
  /** True when an auth operation (e.g., sign out) is in progress */
  loading: boolean;
  /** Signs out the current user and redirects to login */
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * SessionProvider
 *
 * Provides authentication state to the application via React Context.
 * Wraps the app (or protected routes) to give child components access
 * to the current user and auth methods via the `useAuth` hook.
 *
 * Features:
 * - Hydrates with server-side user data to avoid loading flash
 * - Subscribes to auth state changes (login/logout from other tabs, token refresh)
 * - Provides signOut method that clears session and redirects to login
 *
 * @param children - Child components that will have access to auth context
 * @param initialUser - User object from server-side auth check (for SSR hydration)
 *
 * @example
 * // In a layout file:
 * const user = await supabase.auth.getUser();
 * <SessionProvider initialUser={user}>
 *   {children}
 * </SessionProvider>
 */
export function SessionProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const router = useRouter();

  useEffect(() => {
    // Subscribe to session changes and update user state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    router.push("/auth/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
} 

/**
 * Custom hook to access authentication context.
 * @returns {AuthContextType} The authentication context containing user info and auth methods.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a SessionProvider");
  }
  return context;
}