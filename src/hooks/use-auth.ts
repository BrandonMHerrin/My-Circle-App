"use client";

import { useSupabase } from "@/providers/supabase-provider";

export const useAuth = () => {
    const { user, session, loading, supabase } = useSupabase();

    return {
        user,
        session,
        loading,
        signOut: () => supabase.auth.signOut(),
    };
};
