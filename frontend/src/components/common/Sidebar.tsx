import {
  LayoutDashboard,
  FileText,
  Search,
  Bot,
  GraduationCap,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: FileText,
    label: "Documents",
    path: "/documents",
  },
  {
    icon: Search,
    label: "AI Search",
    path: "/search",
  },
  {
    icon: Bot,
    label: "AI Chat",
    path: "/chat",
  },
  {
    icon: GraduationCap,
    label: "Study Assistant",
    path: "/study",
  },
  {
    icon: CalendarDays,
    label: "Timeline",
    path: "/timeline",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900 px-6 py-8">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          StudyOS
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Your AI study workspace
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex w-full items-center gap-4 rounded-2xl px-4 py-3",
                  "text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="mt-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">
            Logged in as
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Anu
              </h2>

              <p className="text-xs text-slate-500">
                Student
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}