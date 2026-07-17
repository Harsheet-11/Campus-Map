import { ReactNode } from "react";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="fixed inset-0 overflow-hidden">
      {children}
    </main>
  );
}