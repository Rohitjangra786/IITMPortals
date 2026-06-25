"use client";

import { Building2, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark, BrandTitle } from "./brand";
import { Button, cn } from "./ui";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/institutes", label: "Institutes", icon: Building2 },
];

export function Nav({ userName, userRole }: { userName: string; userRole: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      {/* Institutional accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-brand-700 to-brand-400" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="hidden sm:block">
              <BrandTitle />
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-800"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2.5 sm:flex">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800"
              aria-hidden
            >
              {initials || "U"}
            </span>
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs capitalize text-slate-500">{userRole}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={signOut} disabled={signingOut}>
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
