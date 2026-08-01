import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import DocumentsPage from "../pages/Documents/DocumentsPage";
import SearchPage from "../pages/Search/SearchPage";
import ChatPage from "../pages/Chat/ChatPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}