"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import * as React from "react";
import { FcGoogle } from "react-icons/fc";

type LoginFormProps = React.ComponentProps<"form"> & {
  title?: string;
};

export default function LoginForm({
  title = "Login",
  className,
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  const signInGoogle = async () => {
    try {
      console.log("Sign in with Google clicked");
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        console.error('Error signing in with Google.');
      }
      console.log("Redirecting to Google for authentication...");
    } catch (error) {
      console.error('Unexpected error: ', error);
    } finally {
      setIsLoading(false);
      console.log("Finished sign in with Google process");
    }
  }  

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Sign in to your google account
      </h2>

      <button
        onClick={signInGoogle}
        disabled={isLoading}
        type="button"
        className="w-full mt-4 py-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 rounded-md flex items-center justify-center gap-2"
      >
        <FcGoogle className="inline text-2xl w-auto" /> {isLoading ? "Connecting..." : "Continue with Google"}
      </button>
    </>
  );
}