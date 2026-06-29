import { ClipboardCheck, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/auth";
import { BrandMark } from "@/components/brand";
import { HeroCanvas } from "@/components/hero-canvas";
import { Button, Field, Input } from "@/components/ui";

const TRUST_POINTS = [
  {
    icon: ClipboardCheck,
    title: "Faithful to the official report",
    body: "Every Part I–III parameter, scored exactly as the GGSIPU format prescribes.",
  },
  {
    icon: ShieldCheck,
    title: "Auto-scored & auditable",
    body: "Teacher-Student & Faculty Cadre ratios, totals and category computed live.",
  },
  {
    icon: Lock,
    title: "Secure committee access",
    body: "Session-based sign-in for chairpersons, experts and convenors.",
  },
];

function LoginForm() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [params] = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Sign in failed.");
        return;
      }
      await refresh();
      navigate(next);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200"
        >
          {error}
        </div>
      ) : null}
      <Field label="Email address" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@institute.edu.in"
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Trust panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
          aria-hidden
        />
        {/* Peacock-blue WebGL particle field (decorative, behind content). */}
        <HeroCanvas />
        <div className="relative z-10 flex items-center gap-3">
          <BrandMark size={44} />
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">JAC Inspection Portal</p>
            <p className="text-xs text-slate-300">GGSIPU · GNCT of Delhi</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-3xl font-bold leading-tight">
            Joint Assessment Committee inspections, done right.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Digitising the assessment of existing institutes — Technical &amp; Non-Technical
            courses, Academic Session 2026-27.
          </p>
          <ul className="mt-8 space-y-5">
            {TRUST_POINTS.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/15">
                    <Icon className="h-5 w-5 text-brand-300" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="text-xs leading-relaxed text-slate-400">{t.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-slate-400">
          Guru Gobind Singh Indraprastha University · Sector-16C, Dwarka, New Delhi
        </p>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <BrandMark size={52} />
            <h1 className="mt-3 font-display text-xl font-bold text-slate-900">
              JAC Inspection Portal
            </h1>
            <p className="text-sm text-slate-500">GGSIPU · GNCT of Delhi</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Sign in to continue
            </h2>
            <p className="mt-1 mb-5 text-sm text-slate-500">
              Use your committee member credentials.
            </p>
            <LoginForm />
            <p className="mt-6 text-center text-sm text-slate-500">
              New committee member?{" "}
              <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
