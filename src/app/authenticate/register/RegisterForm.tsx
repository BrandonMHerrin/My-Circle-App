"use client"
import * as React from "react";

export default function registerForm({
    ...props
}: React.ComponentProps<"form">) {
    const[isLoading, setIsLoading] = React.useState<boolean>(false)

    async function onSubmit(event: React.SyntheticEvent){
        event.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 3000)
    }
    return (
        <>
        <h2 className="text-2xl font-bold text-center text-gray-800">
            Create your account
        </h2>
        <form id="registerForm" onSubmit={onSubmit} className={props.className} {...props}>
            <div>
                <label htmlFor="fname" className="mt-5 block text-sm font-medium text-gray-800">
                    First Name
                </label>
                    <input
                        id="fname"
                        name="fname"
                        type="text"
                        autoComplete="fname"
                        placeholder="John"
                        required
                        className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-indigo-500"
                    />
                <label htmlFor="lname" className="block text-sm font-medium text-gray-800 mt-3">
                    Last Name
                </label>
                <input
                    id="lname"
                    name="lname"
                    type="text"
                    autoComplete="lname"
                    placeholder="Doe"
                    required
                    className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-indigo-500"
                />
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mt-3">
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@mail.com"
                    required
                    className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-indigo-500"
                />
                <label htmlFor="dob" className="block text-sm font-medium text-gray-800 mt-3">
                    Date of Birth
                </label>
                <input
                    id="dob"
                    name="dob"
                    type="date"
                    autoComplete="dob"
                    required
                    className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-indigo-500"
                />
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mt-3">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-black"
                />
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mt-3">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="mt-1 p-1 text-gray-800 block w-full border border-solid border-gray-400 rounded-md shadow-sm rounded-sm shadow-sm focus:border-black"
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md"
                >
                    {isLoading ? "Registering..." : "Manage Your Circle"}
                </button>
            </div>
        </form> 
    </>
    )
}