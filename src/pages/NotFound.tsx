import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-5xl font-bold text-slate-900">404</p>
      <p className="text-sm text-slate-500">This page could not be found.</p>
      <Link
        to="/dashboard"
        className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
