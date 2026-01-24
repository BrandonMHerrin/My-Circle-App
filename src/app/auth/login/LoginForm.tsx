"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import * as React from "react";

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
        Sign in to your account
      </h2>

      <form onSubmit={onSubmit} className={className} {...props}>
        <label className="mt-5 block text-sm font-medium text-gray-800">
          Email address
        </label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-black"
        />

        <label className="mt-3 block text-sm font-medium text-gray-800">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-black"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <button
        onClick={signInGoogle}
        disabled={isLoading}
        type="button"
        className="w-full mt-4 py-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 rounded-md flex items-center justify-center gap-2"
      >
        {isLoading ? "Connecting..." : "Continue with Google"}
      </button>

      <div className="mt-3 text-sm text-gray-700">
        Don&apos;t have an account?{" "}
        <Link href="/authenticate/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </>
  );
}