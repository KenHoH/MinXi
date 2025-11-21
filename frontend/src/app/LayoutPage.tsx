import type React from "react";
import { Sidebar } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="ml-20 w-full min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
