"use client";

import Link from "next/link";
import * as React from "react";

type LoginFormProps = React.ComponentProps<"form"> & {
  title?: string;
};

export default function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual email/password login logic
    setTimeout(() => {
      setIsLoading(false);
      alert("Email/Password login is not yet implemented. Please use Google Login for now.");
    }, 1500);
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Sign in to your account
      </h2>

      <form onSubmit={onSubmit} className={className} {...props}>
        <div className="space-y-4">
          <div>
            <label className="mt-5 block text-sm font-medium text-gray-800">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
            />
          </div>

          <div>
            <label className="mt-3 block text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md font-medium disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-700">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </>
  );
}