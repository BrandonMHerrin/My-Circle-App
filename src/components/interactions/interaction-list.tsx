"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";

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
        `${x.contact?.fname ?? ""} ${x.contact?.lname ?? ""}`
          .trim()
          .toLowerCase();

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
      setItems(prev);
      alert(e?.message ?? "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search notes, contacts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-white/50"
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[140px] bg-white/50">
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

          <Button
            variant="outline"
            onClick={load}
            disabled={loading}
            className="bg-white/50 shrink-0"
          >
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      ) : err ? (
        <p className="text-sm text-red-500 p-4 bg-red-50 rounded-xl">{err}</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground p-4 text-center">
          No interactions found.
        </p>
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
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-white/80 ring-1 ring-black/5 p-4 shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-neutral-900 truncate">
                      {contactLabel}
                    </p>
                    <Badge variant="secondary" className="bg-sky-100 text-sky-800 border-none px-2 py-0">
                      {x.type}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-neutral-500">
                    {x.interaction_date}
                  </p>
                  <p className="text-sm text-neutral-700 line-clamp-2">
                    {x.notes || "(no notes)"}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="flex-1 sm:flex-none h-9 rounded-xl hover:bg-sky-50 text-sky-700 font-medium"
                  >
                    <Link href={`/interactions/${x.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 sm:flex-none h-9 rounded-xl hover:bg-rose-50 text-rose-600 font-medium"
                    onClick={() => onDelete(x.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
