"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as React from "react";

export default function RegisterForm({
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const fname = formData.get("fname") as string;
        const lname = formData.get("lname") as string;
        const email = formData.get("email") as string;
        const dob = formData.get("dob") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        fname,
                        lname,
                        dob,
                    },
                },
            });

            if (signUpError) {
                throw signUpError;
            }

            if (data.session) {
                console.log("[RegisterForm] Registration successful, session found.");
                router.push("/dashboard");
            } else {
                // This might happen if email confirmation is required
                console.log("[RegisterForm] Registration successful, check email.");
                alert("Registration successful! Please check your email for confirmation.");
                router.push("/auth/login");
            }
        } catch (err: any) {
            console.error("[RegisterForm] Error:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h2 className="text-2xl font-bold text-center text-gray-800">
                Create your account
            </h2>

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            <form
                id="registerForm"
                onSubmit={onSubmit}
                className={props.className}
                {...props}
            >
                <div className="space-y-4">
                    <div className="space-y-4 mt-5">
                        <div>
                            <label
                                htmlFor="fname"
                                className="block text-sm font-medium text-gray-800"
                            >
                                First Name
                            </label>
                            <input
                                id="fname"
                                name="fname"
                                type="text"
                                autoComplete="fname"
                                placeholder="John"
                                required
                                className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lname"
                                className="block text-sm font-medium text-gray-800"
                            >
                                Last Name
                            </label>
                            <input
                                id="lname"
                                name="lname"
                                type="text"
                                autoComplete="lname"
                                placeholder="Doe"
                                required
                                className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-800"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="your@mail.com"
                            required
                            className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-800"
                        >
                            Date of Birth
                        </label>
                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            autoComplete="dob"
                            required
                            className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-800"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-800"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="mt-1 p-2 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm focus:border-black outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md font-medium disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? "Registering..." : "Manage Your Circle"}
                    </button>
                </div>
            </form>
        </>
    );
}