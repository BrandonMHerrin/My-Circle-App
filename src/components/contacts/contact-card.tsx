"use client";

import { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface ContactCardProps {
  contact: Tables<"contacts">;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({
  contact,
  onClick,
  onEdit,
  onDelete,
}: ContactCardProps) {
  // Color mapping for relationship types
  const relationshipColors: Record<string, string> = {
    family: "bg-purple-100 text-purple-800",
    friend: "bg-blue-100 text-blue-800",
    colleague: "bg-green-100 text-green-800",
    acquaintance: "bg-gray-100 text-gray-800",
    // Add more as needed
  };

  // Default fallback color
  const getRelationshipColor = (type: string) => {
    console.log("Relationship type:", type);
    return (
      relationshipColors[type.toLowerCase()] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl bg-white/80 ring-1 ring-black/5 p-4 shadow-sm hover:shadow-md transition-all gap-4 cursor-pointer"
      onClick={() => onClick(contact.id)}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-neutral-900 text-lg truncate pr-2">
            {contact.fname || contact.lname
              ? `${contact.fname} ${contact.lname}`.trim()
              : "Unnamed Contact"}
          </h3>
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getRelationshipColor(
              contact.relationship ?? ""
            )}`}
          >
            {contact.relationship || "Unspecified"}
          </span>
        </div>

        <div className="space-y-0.5 text-sm text-neutral-600">
          {contact.email && <p className="truncate">{contact.email}</p>}
          {contact.phone && <p>{contact.phone}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-neutral-100">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onEdit(contact.id);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete(contact.id);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}