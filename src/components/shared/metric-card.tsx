import Link from "next/link";
import { CardHeader, CardTitle, CardContent, Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { LucideIcon } from "lucide-react";

/**
 * MetricCardWith
 *
 * A reusable card component for displaying key metrics on the dashboard.
 * Each card includes a title, an icon, and a value, and links to a relevant page for more details.
 *
 * @param href - The URL to navigate to when the card is clicked.
 * @param title - The title of the metric being displayed (e.g., "Total Contacts").
 * @param value - The numeric value of the metric (e.g., 42).
 * @param icon - A LucideIcon component representing the metric visually.
 *
 * @example
 * <MetricCardWith href="/contacts" title="Total Contacts" value={42} icon={Users} />
 */
export function MetricCard({ href, title, value, icon: Icon }: { href: string; title: string; value: number; icon: LucideIcon }) {
  return (
    <Link href={href} className="h-full">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * MetricCardSkeleton
 *
 * A placeholder skeleton component for the MetricCard while data is loading.
 * Provides visual feedback to users during loading states on the dashboard.
 * Using the same structure as MetricCardWith but with Skeleton components instead of actual data.
 * This component can be used in the Suspense fallback for each metric card on the dashboard.
 *
 * @example
 * <Suspense fallback={<MetricCardSkeleton />}>
 *   <MetricCardWith href="/contacts" title="Total Contacts" value={42} icon={Users} />
 * </Suspense>
 */
export function MetricCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" /> {/* title */}
        <Skeleton className="h-4 w-4" /> {/* icon */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" /> {/* value */}
      </CardContent>
    </Card>
  );
}