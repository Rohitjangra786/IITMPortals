import Link from "next/link";
import { NewInstituteForm } from "@/components/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InstitutesPage() {
  const institutes = await prisma.institute.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { inspections: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Register institutes and start their JAC inspection reports.
          </p>
        </div>
        <NewInstituteForm />
      </div>

      {institutes.length === 0 ? (
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
              href={`/institutes/${inst.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
            >
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-700">
                {inst.name}
              </h3>
              {inst.district ? (
                <p className="mt-1 text-sm text-slate-500">{inst.district}</p>
              ) : null}
              {inst.societyName ? (
                <p className="mt-2 text-xs text-slate-400">{inst.societyName}</p>
              ) : null}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  {inst._count.inspections} inspection
                  {inst._count.inspections === 1 ? "" : "s"}
                </span>
                <span className="font-semibold text-brand-700">View →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
