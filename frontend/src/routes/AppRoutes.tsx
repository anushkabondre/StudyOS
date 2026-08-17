import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">{title}</h1>

        <p className="mt-2 text-slate-400">
          This feature is coming in the next StudyOS version.
        </p>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <DashboardShell>
              <DashboardPage />
            </DashboardShell>
          }
        />

        <Route
          path="/documents"
          element={
            <DashboardShell>
              <PlaceholderPage title="Documents" />
            </DashboardShell>
          }
        />

        <Route
          path="/search"
          element={
            <DashboardShell>
              <PlaceholderPage title="AI Search" />
            </DashboardShell>
          }
        />

        <Route
          path="/chat"
          element={
            <DashboardShell>
              <PlaceholderPage title="AI Chat" />
            </DashboardShell>
          }
        />

        <Route
          path="/study"
          element={
            <DashboardShell>
              <PlaceholderPage title="Study Assistant" />
            </DashboardShell>
          }
        />

        <Route
          path="/timeline"
          element={
            <DashboardShell>
              <PlaceholderPage title="Timeline" />
            </DashboardShell>
          }
        />

        <Route
          path="/settings"
          element={
            <DashboardShell>
              <PlaceholderPage title="Settings" />
            </DashboardShell>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}