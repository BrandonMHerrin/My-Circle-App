"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

export default function RemindersList() {
  const [items, setItems] = useState<Tables<"reminders">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadReminders() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/reminders?limit=100&offset=0", {
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to load reminders");
      }

      const data = await res.json();
      const list =
    Array.isArray(data?.reminders)
    ? data.reminders
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

    setItems(list);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReminders();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button asChild>
          <Link href="/reminders/new" className="gap-2">
            <Plus className="h-4 w-4" />
            New Reminder
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reminders found.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">
                      {reminder.reminder_type?.replace("_", " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reminder.message || "(no message)"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2"
                  >
                    <Link href={`/reminders/${reminder.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
