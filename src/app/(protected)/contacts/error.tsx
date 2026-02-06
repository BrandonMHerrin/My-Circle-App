"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ContactsErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-md p-6 text-center">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="size-12 text-destructive" />
        </div>
        <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
        <p className="mb-4 text-muted-foreground">
          We couldn&apos;t load your contacts. Please try again.
        </p>
        <Button onClick={reset}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </Card>
    </div>
  );
}