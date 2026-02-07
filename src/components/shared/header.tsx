import { UserMenu } from "./user-menu";

/**
 * Header
 *
 * Reusable page header component that displays a title and user menu.
 * Each page imports and renders this component with its own title.
 *
 * This is a shared component (not in layout) because the title varies per page.
 * The UserMenu is included here and consumes auth state from SessionProvider.
 *
 * @param title - The page title to display (e.g., "Dashboard", "Contacts")
 *
 * @example
 * // In a page component:
 * export default function DashboardPage() {
 *   return (
 *     <>
 *       <Header title="Dashboard" />
 *       {/* page content *\/}
 *     </>
 *   );
 * }
 */
export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      {/* ===== HEADER SECTION ===== */}
      {/* Displays page title and user context */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* User quick info and logout action */}
        <UserMenu />
      </header>
    </>
  );
}
