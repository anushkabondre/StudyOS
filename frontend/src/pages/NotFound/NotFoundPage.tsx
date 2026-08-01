import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <h1 className="text-7xl font-bold">404</h1>

      <p className="mt-4 text-slate-400">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
}