import type { ReactNode } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Navbar />

        <div className="overflow-y-auto p-6 sm:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}