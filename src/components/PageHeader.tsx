"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode; // Extra actions on the right side
    showUserActions?: boolean;
}

export function PageHeader({
    title,
    description,
    children,
    showUserActions = true,
}: PageHeaderProps) {
    const { user, signOut } = useAuth();

    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Page-specific actions (e.g. "Save" or "Add") */}
                {children}

                {/* Global User Info & Logout */}
                {showUserActions && (
                    <div className="flex items-center gap-3 border-l pl-4 border-muted/50 ml-2">
                        <span className="text-sm text-muted-foreground hidden md:inline-block">
                            {user?.email || "User"}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => signOut()}>
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
