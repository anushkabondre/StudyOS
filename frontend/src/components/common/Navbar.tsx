import {
  Bell,
  Search,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6 sm:px-8 lg:px-10">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search your study material..."
            className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900/60 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Right side */}
        <div className="ml-6 flex items-center gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-400 transition hover:border-blue-500/30 hover:text-white sm:flex"
          >
            <Sparkles size={16} className="text-blue-400" />
            Ask AI
          </button>

          <button
            type="button"
            className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-slate-400 transition hover:border-slate-700 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
          </button>

          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white">
              A
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                Anu
              </p>

              <p className="text-xs text-slate-500">
                Student
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}