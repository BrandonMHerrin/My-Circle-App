"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { type SupabaseClient, type User, type Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type SupabaseContext = {
    supabase: SupabaseClient;
    user: User | null;
    session: Session | null;
    loading: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [supabase] = useState(() => createClient());
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getSession = async () => {
            try {
                // 1. Try standard SDK lookup
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();

                if (currentSession) {
                    console.log("[SupabaseProvider] Session found via SDK");
                    setSession(currentSession);
                    setUser(currentSession.user);
                } else {
                    // 2. SELF-HEALING: Check LocalStorage manually
                    const projectId = window.location.hostname === 'localhost' ? 'wqcigydfexjnvqmpxgry' : '';
                    const storageKey = 'sb-' + projectId + '-auth-token';
                    const localData = localStorage.getItem(storageKey);

                    if (localData) {
                        console.log("[SupabaseProvider] Found session in LocalStorage but not SDK. Force syncing...");
                        try {
                            const parsed = JSON.parse(localData);
                            // If it's the raw array format from V6
                            if (Array.isArray(parsed) && parsed[0]) {
                                await supabase.auth.setSession({
                                    access_token: parsed[0],
                                    refresh_token: parsed[1]
                                });
                            } else {
                                await supabase.auth.setSession(parsed);
                            }
                            // Re-fetch to confirm
                            const { data: { session: recovered } } = await supabase.auth.getSession();
                            if (recovered) {
                                setSession(recovered);
                                setUser(recovered.user);
                            }
                        } catch (e) {
                            console.error("[SupabaseProvider] Recovery failed:", e);
                        }
                    }
                }
            } catch (err) {
                console.error("[SupabaseProvider] Fatal session error:", err);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, newSession) => {
                console.log("[SupabaseProvider] Event: " + event);
                setSession(newSession);
                setUser(newSession?.user ?? null);
                setLoading(false);

                if (event === 'SIGNED_IN') {
                    router.refresh();
                }
                if (event === 'SIGNED_OUT') {
                    router.push('/auth/login');
                    router.refresh();
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    return (
        <Context.Provider value={{ supabase, user, session, loading }}>
            {children}
        </Context.Provider>
    );
}

export const useSupabase = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("useSupabase must be used inside SupabaseProvider");
    }
    return context;
};
