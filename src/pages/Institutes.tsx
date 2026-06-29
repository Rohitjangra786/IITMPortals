import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { NewInstituteForm } from "@/components/actions";
import { useResource } from "@/hooks/useResource";

interface InstituteCard {
  id: string;
  name: string;
  district: string;
  societyName: string;
  _count: { inspections: number };
}

export function InstitutesPage() {
  const { data, loading, reload } = useResource<{ institutes: InstituteCard[] }>(
    "/api/institutes",
  );
  const institutes = data?.institutes ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Institutes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register institutes and start their JAC inspection reports.
          </p>
        </div>
        <NewInstituteForm onChanged={reload} />
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
          Loading…
        </div>
      ) : institutes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">
            No institutes yet. Click <span className="font-semibold">Add institute</span> to begin.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {institutes.map((inst) => (
            <Link
              key={inst.id}
              to={`/institutes/${inst.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
                  <Building2 className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold text-slate-900 group-hover:text-brand-700">
                    {inst.name}
                  </h3>
                  {inst.district ? (
                    <p className="mt-0.5 truncate text-sm text-slate-500">{inst.district}</p>
                  ) : null}
                </div>
              </div>
              {inst.societyName ? (
                <p className="mt-3 truncate text-xs text-slate-400">{inst.societyName}</p>
              ) : null}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  {inst._count.inspections} inspection
                  {inst._count.inspections === 1 ? "" : "s"}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
                  View <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
