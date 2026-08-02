import { ReactNode } from "react";
import QueryProvider from "@/components/providers/QueryProvider";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="fixed inset-0 overflow-hidden">
      <QueryProvider>
      {children}
      </QueryProvider>
    </main>
  );
}