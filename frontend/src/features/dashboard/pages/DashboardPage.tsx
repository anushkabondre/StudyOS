import {
  BookOpen,
  BrainCircuit,
  FileText,
} from "lucide-react";

import StatCard from "../../../components/ui/StatCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-10">
      <h1 className="mb-2 text-5xl font-bold text-white">
        Good Morning 👋
      </h1>

      <p className="mb-10 text-slate-400">
        Welcome back to StudyOS.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Documents"
          value="24"
          icon={FileText}
        />

        <StatCard
          title="AI Searches"
          value="12"
          icon={BrainCircuit}
        />

        <StatCard
          title="Study Sessions"
          value="8"
          icon={BookOpen}
        />
      </div>
    </div>
  );
}