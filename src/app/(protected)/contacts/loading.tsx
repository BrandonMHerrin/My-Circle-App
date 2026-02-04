import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading
 *
 * Displays a loading skeleton for the Contacts page while data is being fetched.
 * Provides visual feedback to users during loading states.
 */
export default function Loading() {
  return (
    <>
      <Header
        title="Contacts"
        subtitle="Manage your contacts and their details"
      />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-5 w-32 mb-2" /> {/* name */}
            <Skeleton className="h-4 w-48 mb-1" /> {/* email */}
            <Skeleton className="h-4 w-36" /> {/* phone */}
          </Card>
        ))}
      </section>
    </>
  );
}
