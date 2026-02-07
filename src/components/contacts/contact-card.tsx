"use client";

import { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader } from "./ui/card";
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
    <Card
      className="p-3 sm:p-4 cursor-pointer hover:bg-accent hover:shadow-md transition-all"
      onClick={() => onClick(contact.id)}
    >
      <CardHeader className="text-lg font-semibold">
        {contact.fname || contact.lname
          ? `${contact.fname} ${contact.lname}`.trim()
          : "Unnamed Contact"}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Email: {contact.email || "N/A"}
        </p>
        <p className="text-sm text-muted-foreground">
          Phone: {contact.phone || "N/A"}
        </p>
        <p className="text-sm text-muted-foreground">
          Relationship:{" "}
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRelationshipColor(contact.relationship)}`}
          >
            {contact.relationship || "Unspecified"}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEdit(contact.id);
            }}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(contact.id);
            }}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
}