import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export async function InteractionsFeed() {
  const supabase = await createClient();

  const { data: interactions, error } = await supabase
    .from("interactions")
    .select("id, contact_id, interaction_date, notes, contacts(fname, lname), type")
    .order("interaction_date", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error("Failed to load interactions feed");
  }

  if (!interactions || interactions.length === 0) {
    return <p className="text-sm text-muted-foreground">No interactions found. Start by logging a new interaction!</p>;
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {interactions.map((interaction) => (
        <ActivityItem
          key={interaction.id}
          id={interaction.id}
          text={`${interaction.notes} with ${interaction.contacts?.fname} ${interaction.contacts?.lname || "Unknown Contact"}`}
          time={new Date(interaction.interaction_date).toLocaleString()}
          type={interaction.type || "Unknown Type"}
        />
      ))}
    </div>
  );
}

export function InteractionsFeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-3 animate-pulse">
          <div>
            <div className="h-4 w-32 rounded bg-gray-300 mb-2"></div>
            <div className="h-3 w-24 rounded bg-gray-200"></div>
          </div>
          <div className="h-8 w-16 rounded bg-gray-300"></div>
        </div>
      ))}
    </div>
  );
}


/**
 * ActivityItem
 * Reusable component for displaying a single interaction in the activity feed.
 */
function ActivityItem({
  id,
  text,
  time,
  type,
}: {
  id: string;
  text: string;
  time: string;
  type: string;
}) {
  // calculate time since interaction for display (e.g., "2 hours ago")
  const timeSince = (() => {
    const now = new Date();
    const interactionTime = new Date(time);
    const diffInSeconds = Math.floor((now.getTime() - interactionTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  })();
  
  return (
    <Link href={`/interactions/${id}/edit`} className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">{text}</p>
          <Badge variant="secondary">{type}</Badge>
        </div>
        {/* Time since interaction */}
        <p className="text-xs text-muted-foreground">{timeSince}</p>
      </div>
    </Link>
  );
}
