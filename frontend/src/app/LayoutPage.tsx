import { Sidebar } from "@/shared/components/Sidebar";
import type React from "react";
import Snowfall from "react-snowfall";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-dark-900">
      <Snowfall />
      <Sidebar />
      <main className="ml-20 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
