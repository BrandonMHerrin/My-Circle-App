export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Centered content container with max width */}
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
          {children}
        </div>
      </div>
    </>
  );
}
