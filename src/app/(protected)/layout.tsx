
import { NotebookShell } from "@/components/notebook/notebook-shell";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NotebookShell>{children}</NotebookShell>;
}
