"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ApiClientError } from '../../lib/apiClient';
import { useToast } from '../../components/ToastProvider';
import AppSelect from '../../components/forms/AppSelect';
import AppDatePicker from '../../components/forms/AppDatePicker';
import CurrencyInput from '../../components/forms/CurrencyInput';

interface Option {
  id: number;
  name?: string;
  title?: string;
}

const STAGE_OPTIONS = ["New Deal", "Negotiation", "Booking", "Documentation"] as const;
const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const;

export default function AddDealPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [clients, setClients] = useState<Option[]>([]);
  const [properties, setProperties] = useState<Option[]>([]);
  const [agents, setAgents] = useState<Option[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    clientId: "",
    propertyId: "",
    price: "",
    expectedCloseAt: null as string | null,
    stage: "New Deal",
    priority: "Medium",
    agentId: "",
  });

  useEffect(() => {
    api.get<Option[]>("/api/clients?pageSize=100").then(({ data }) => setClients(data)).catch(() => {});
    api.get<Option[]>("/api/properties").then(({ data }) => setProperties(data)).catch(() => {});
    api.get<Option[]>("/api/team").then(({ data }) => setAgents(data)).catch(() => {});
  }, []);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.title.trim().length < 2) next.title = "Deal title is required";
    if (!form.clientId) next.clientId = "Select a client";
    if (!form.price) next.price = "Deal value is required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await api.post("/api/deals", {
        title: form.title.trim(),
        clientId: Number(form.clientId),
        propertyId: form.propertyId ? Number(form.propertyId) : null,
        price: parseFloat(form.price) || 0,
        stage: form.stage,
        priority: form.priority,
        agentId: form.agentId ? Number(form.agentId) : null,
        expectedCloseAt: form.expectedCloseAt,
      });
      success(`Deal "${form.title.trim()}" created.`);
      router.push("/deals");
    } catch (err) {
      setSaving(false);
      if (err instanceof ApiClientError) {
        if (err.fields) setErrors(err.fields);
        toastError(err.message === "Validation failed" ? "Please fix the highlighted fields." : err.message);
      } else {
        toastError("Something went wrong while creating the deal.");
      }
    }
  }

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="max-w-4xl py-4 mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/deals" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-headline-lg text-on-surface">Create New Deal</h1>
          <p className="text-body-md text-secondary mt-1">Add a new opportunity to your pipeline.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Deal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="deal-title" className="text-label-sm text-on-surface-variant">Deal Title *</label>
                <input id="deal-title" type="text" className={inputClass} placeholder="e.g. Skyline Penthouse Sale" required
                  value={form.title} onChange={(e) => set("title", e.target.value)} />
                {errors.title && <p className="text-body-sm text-error">{errors.title}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="deal-client" className="text-label-sm text-on-surface-variant">Client/Lead *</label>
                <AppSelect instanceId="deal-client" isSearchable placeholder="Select a client..."
                  value={form.clientId || null} onChange={(v) => set("clientId", v ?? "")}
                  options={clients.map((c) => ({ value: String(c.id), label: c.name ?? "" }))} />
                {errors.clientId && <p className="text-body-sm text-error">{errors.clientId}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="deal-property" className="text-label-sm text-on-surface-variant">Related Property</label>
                <AppSelect instanceId="deal-property" isSearchable isClearable placeholder="Select a property..."
                  value={form.propertyId || null} onChange={(v) => set("propertyId", v ?? "")}
                  options={properties.map((p) => ({ value: String(p.id), label: p.title ?? "" }))} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="deal-value" className="text-label-sm text-on-surface-variant">Deal Value ($) *</label>
                <CurrencyInput id="deal-value" className={inputClass} placeholder="$0" required
                  value={form.price} onChange={(v) => set("price", v)} />
                {errors.price && <p className="text-body-sm text-error">{errors.price}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="deal-close-date" className="text-label-sm text-on-surface-variant">Expected Close Date</label>
                <AppDatePicker id="deal-close-date" className={inputClass}
                  value={form.expectedCloseAt} onChange={(v) => set("expectedCloseAt", v)}
                  minDate={new Date().toISOString().slice(0, 10)} placeholder="Select date" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Pipeline Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="deal-stage" className="text-label-sm text-on-surface-variant">Stage</label>
                <AppSelect instanceId="deal-stage"
                  value={form.stage} onChange={(v) => set("stage", v ?? "New Deal")}
                  options={STAGE_OPTIONS.map((s) => ({ value: s, label: s }))} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="deal-priority" className="text-label-sm text-on-surface-variant">Priority</label>
                <AppSelect instanceId="deal-priority-add"
                  value={form.priority} onChange={(v) => set("priority", v ?? "Medium")}
                  options={PRIORITY_OPTIONS.map((p) => ({ value: p, label: p }))} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="deal-agent" className="text-label-sm text-on-surface-variant">Assigned Agent</label>
                <AppSelect instanceId="deal-agent" isSearchable isClearable placeholder="Unassigned"
                  value={form.agentId || null} onChange={(v) => set("agentId", v ?? "")}
                  options={agents.map((a) => ({ value: String(a.id), label: a.name ?? "" }))} />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Link href="/deals" className="px-6 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
              {saving ? "Creating..." : "Create Deal"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
