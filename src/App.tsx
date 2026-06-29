import { type ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import { isIitmEmail } from "./brand-config";
import { Nav } from "./components/nav";
import { DashboardPage } from "./pages/Dashboard";
import { InspectionPage } from "./pages/Inspection";
import { InstituteDetailPage } from "./pages/InstituteDetail";
import { InstitutesPage } from "./pages/Institutes";
import { LoginPage } from "./pages/Login";
import { NotFoundPage } from "./pages/NotFound";
import { RegisterPage } from "./pages/Register";
import { ReportPage } from "./pages/Report";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
      Loading…
    </div>
  );
}

/** Gate for the authenticated area — redirects to /login when signed out. */
function Protected({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user === undefined) return <FullScreenLoader />;
  if (user === null) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return <>{children}</>;
}

/** Gate for auth pages — bounce signed-in users to the dashboard. */
function AuthOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user === undefined) return <FullScreenLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppLayout() {
  const { user } = useAuth();
  // The app uses one peacock-blue theme everywhere. IITM-domain users still get
  // the IITM logo in the nav (just the logo, no colour change).
  const iitm = isIitmEmail(user?.email);
  return (
    <div className="min-h-screen">
      <Nav userName={user?.name ?? ""} userRole={user?.role ?? ""} iitm={iitm} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthOnly>
            <LoginPage />
          </AuthOnly>
        }
      />
      <Route
        path="/register"
        element={
          <AuthOnly>
            <RegisterPage />
          </AuthOnly>
        }
      />

      <Route
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/institutes" element={<InstitutesPage />} />
        <Route path="/institutes/:id" element={<InstituteDetailPage />} />
        <Route path="/inspections/:id" element={<InspectionPage />} />
        <Route path="/inspections/:id/report" element={<ReportPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
