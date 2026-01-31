"use client";

import { createClient } from "@/lib/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

export default function SocialButtons() {
    const [isLoading, setIsLoading] = useState(false);

    const signInWithProvider = async (provider: 'google' | 'github') => {
        try {
            console.log(`Sign in with ${provider} clicked`);
            setIsLoading(true);
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) {
                console.error(`Error signing in with ${provider}:`, error.message);
            }
        } catch (error) {
            console.error('Unexpected error: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-3 text-left text-gray-700 w-full flex flex-col gap-2">
            <button
                onClick={() => signInWithProvider('google')}
                disabled={isLoading}
                className="border border-solid border-gray-300 rounded-md shadow-sm p-2 w-full text-center hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <FcGoogle className="text-2xl" />
                {isLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <button
                onClick={() => signInWithProvider('github')}
                disabled={isLoading}
                className="border border-solid border-gray-300 rounded-md shadow-sm p-2 w-full text-center hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <FaGithub className="text-2xl" />
                {isLoading ? "Connecting..." : "Continue with GitHub"}
            </button>
        </div>
    );
}
