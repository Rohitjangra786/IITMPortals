"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, Input } from "./ui";

/** Inline form to create a new institute. */
export function NewInstituteForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    district: "",
    telephone: "",
    website: "",
    email: "",
    societyName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/institutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not create institute.");
        return;
      }
      setForm({
        name: "",
        address: "",
        district: "",
        telephone: "",
        website: "",
        email: "",
        societyName: "",
      });
      setOpen(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Add institute</Button>;
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-base font-semibold text-slate-900">New institute</h3>
      {error ? (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Institute name" className="sm:col-span-2">
          <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Address" className="sm:col-span-2">
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="District">
          <Input value={form.district} onChange={(e) => set("district", e.target.value)} />
        </Field>
        <Field label="Telephone">
          <Input value={form.telephone} onChange={(e) => set("telephone", e.target.value)} />
        </Field>
        <Field label="Website">
          <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
        </Field>
        <Field label="Email">
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Society / Trust / Company" className="sm:col-span-2">
          <Input
            value={form.societyName}
            onChange={(e) => set("societyName", e.target.value)}
          />
        </Field>
      </div>
      <div className="mt-5 flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Create institute"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

/** Button that creates a fresh inspection for an institute and opens it. */
export function StartInspectionButton({
  instituteId,
  variant = "primary",
  label = "Start inspection",
}: {
  instituteId: string;
  variant?: "primary" | "secondary";
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instituteId }),
      });
      const json = await res.json();
      if (res.ok && json.inspection?.id) {
        router.push(`/inspections/${json.inspection.id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant={variant} onClick={start} disabled={loading}>
      {loading ? "Creating…" : label}
    </Button>
  );
}

/** Generic delete control. */
export function DeleteButton({
  url,
  confirmText,
  redirectTo,
  label = "Delete",
}: {
  url: string;
  confirmText: string;
  redirectTo?: string;
  label?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="danger" onClick={remove} disabled={busy}>
      {busy ? "Deleting…" : label}
    </Button>
  );
}
