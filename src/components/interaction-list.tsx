"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InteractionType = "call" | "meeting" | "email" | "text" | "other";

type Interaction = {
  id: string;
  contact_id: string;
  interaction_date: string;
  type: InteractionType;
  notes: string | null;
  location: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
  contact?: {
    id: string;
    fname: string | null;
    lname: string | null;
    email: string | null;
  } | null;
};

export default function InteractionList() {
  const router = useRouter();

  const [items, setItems] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/interactions?limit=100&page=1", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to load interactions (${res.status}): ${txt}`);
      }

      const data = await res.json();
      setItems(Array.isArray(data?.interactions) ? data.interactions : []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load interactions");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return items.filter((x) => {
      const matchesType = typeFilter === "all" ? true : x.type === typeFilter;

      const contactName =
        `${x.contact?.fname ?? ""} ${x.contact?.lname ?? ""}`.trim().toLowerCase();

      const notes = (x.notes ?? "").toLowerCase();
      const loc = (x.location ?? "").toLowerCase();

      const matchesTerm =
        term.length === 0
          ? true
          : contactName.includes(term) || notes.includes(term) || loc.includes(term);

      return matchesType && matchesTerm;
    });
  }, [items, q, typeFilter]);

  async function onDelete(id: string) {
    if (!id) {
      alert("No id found for this interaction.");
      return;
    }

    const ok = confirm("Delete this interaction?");
    if (!ok) return;

    // Optimistic UI
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/interactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed (${res.status}): ${txt}`);
      }

      router.refresh();
    } catch (e: any) {
      // rollback
      setItems(prev);
      alert(e?.message ?? "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      {/* top actions */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>

        <Button asChild className="gap-2">
          <Link href="/interactions/new">
            <Plus className="h-4 w-4" />
            Log Interaction
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Interaction History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Search notes..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>

          {/* list */}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : err ? (
            <p className="text-sm text-red-500">{err}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interactions found.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((x) => {
                const contactLabel =
                  `${x.contact?.fname ?? ""} ${x.contact?.lname ?? ""}`.trim() ||
                  x.contact?.email ||
                  "Contact";

                return (
                  <div
                    key={x.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">
                          {contactLabel} • {x.interaction_date}
                        </p>
                        <Badge variant="secondary">{x.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {x.notes || "(no notes)"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild className="gap-2">
                        <Link href={`/interactions/${x.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => onDelete(x.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
