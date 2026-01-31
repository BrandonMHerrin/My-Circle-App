"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function DebugAuthPage() {
    const { user, loading, session } = useAuth();
    const [clientCookies, setClientCookies] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateCookies = () => {
            setClientCookies(document.cookie.split(';').map(c => c.trim()).filter(Boolean));
        };
        updateCookies();
        const interval = setInterval(updateCookies, 2000);
        return () => clearInterval(interval);
    }, []);

    const clearAllCookies = () => {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        localStorage.clear();
        window.location.reload();
    };

    if (!mounted) return null;

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Diagnostics</h1>

            <section className="p-4 border rounded bg-blue-50">
                <h2 className="font-bold border-bottom mb-2">Auth State</h2>
                <div className="space-y-1">
                    <p>Loading: <span className="font-mono">{loading ? "TRUE" : "FALSE"}</span></p>
                    <p>User logged in: <span className="font-mono">{user ? "YES" : "NO"}</span></p>
                    {user && (
                        <div className="mt-2 p-2 bg-white rounded border text-xs overflow-auto">
                            <p>Email: {user.email}</p>
                            <p>ID: {user.id}</p>
                            <p>Session Active: {!!session ? "YES" : "NO"}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="p-4 border rounded bg-green-50">
                <h2 className="font-bold border-bottom mb-2">Browser Cookies ({clientCookies.length})</h2>
                <div className="flex gap-2 mb-4 flex-wrap">
                    {clientCookies.some(c => c.includes("auth-hydration-v4")) && (
                        <span className="p-1 bg-green-200 text-green-800 rounded text-xs font-bold">✅ HYDRATION V4 OK</span>
                    )}
                </div>
                <div className="space-y-2">
                    {clientCookies.map((cookie, i) => {
                        const [name, value] = cookie.split('=');
                        return (
                            <div key={i} className="text-xs border-b pb-1 last:border-0">
                                <span className={name.startsWith("sb-") ? "text-green-700 font-bold" : "text-gray-600"}>
                                    {name}
                                </span>
                                <span className="ml-2 text-gray-400">(len: {value?.length ?? 0})</span>
                                <div className="mt-1 text-gray-500 font-mono break-all line-clamp-1 hover:line-clamp-none cursor-pointer bg-white/50 p-1 rounded">
                                    {value ? value.substring(0, 50) + "..." : "EMPTY"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="p-4 border rounded bg-yellow-50">
                <h2 className="font-bold border-bottom mb-2">Local Storage (Supabase)</h2>
                <ul className="list-disc pl-5 text-sm">
                    {Object.keys(localStorage).filter(k => k.includes("supabase")).map((key, i) => (
                        <li key={i} className="font-mono truncate">{key}</li>
                    ))}
                    {Object.keys(localStorage).filter(k => k.includes("supabase")).length === 0 && (
                        <li className="text-gray-400 italic">No Supabase keys found</li>
                    )}
                </ul>
            </section>

            <div className="flex gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Refresh Diagnostic
                </button>
                <button
                    onClick={clearAllCookies}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Clear All (Nuclear)
                </button>
            </div>
        </div>
    );
}
