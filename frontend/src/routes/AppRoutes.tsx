import type { ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import LandingPage from "../pages/Landing/LandingPage";

import ProtectedRoute from "./ProtectedRoute";

function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-2 text-slate-400">
          This feature is coming soon.
        </p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Documents" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="AI Search" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="AI Chat" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/study"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Study Assistant" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/timeline"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Timeline" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Settings" />
            </ProtectedLayout>
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}