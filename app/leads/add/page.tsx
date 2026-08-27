"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ApiClientError } from '../../lib/apiClient';
import { useToast } from '../../components/ToastProvider';
import AppSelect from '../../components/forms/AppSelect';
import NumericInput from '../../components/forms/NumericInput';
import type { LeadDTO } from '@/types/leads';

interface AgentOption {
  id: number;
  name: string;
}

const STATUS_OPTIONS = ["New", "Cold", "Warm", "Hot"] as const;
const SOURCE_OPTIONS = ["Website", "Referral", "Social Media", "Walk-in", "Other"] as const;
const PROPERTY_TYPE_OPTIONS = ["Any", "House", "Condo", "Townhouse", "Land"] as const;

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  leadStatus: "New" as (typeof STATUS_OPTIONS)[number],
  source: "Website" as (typeof SOURCE_OPTIONS)[number],
  agentId: "",
  budget: "",
  propertyType: "Any" as (typeof PROPERTY_TYPE_OPTIONS)[number],
  preferredLocation: "",
  notes: "",
};

export default function AddLeadPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [agents, setAgents] = useState<AgentOption[]>([]);

  useEffect(() => {
    api
      .get<AgentOption[]>("/api/team")
      .then(({ data }) => setAgents(data))
      .catch(() => toastError("Could not load the agent list."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (form.firstName.trim().length < 1) next.firstName = "First name is required";
    if (form.lastName.trim().length < 1) next.lastName = "Last name is required";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const lead = await api.post<LeadDTO>("/api/leads", {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        // The "New" option means a fresh lead (stage New, default warmth);
        // Hot/Warm/Cold set the temperature while the stage starts at New.
        stage: "New",
        status: form.leadStatus === "New" ? "Warm" : form.leadStatus,
        source: form.source,
        agentId: form.agentId ? Number(form.agentId) : null,
        budget: form.budget.trim() || null,
        propertyInterest: form.propertyType === "Any" ? null : form.propertyType,
        preferredLocation: form.preferredLocation.trim() || null,
        notes: form.notes.trim() || null,
      });
      success(`Lead "${lead.data.name}" saved successfully.`);
      setForm(INITIAL_FORM);
      router.push("/leads");
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.fields) {
          // Server-side field names → form field names.
          const mapped: Record<string, string> = {};
          for (const [field, message] of Object.entries(err.fields)) {
            mapped[field === "name" ? "firstName" : field] = message;
          }
          setErrors(mapped);
        }
        toastError(err.message === "Validation failed" ? "Please fix the highlighted fields." : err.message);
      } else {
        toastError("Something went wrong while saving the lead.");
      }
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-4">
        <Link href="/leads" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-headline-lg text-on-surface">Add New Lead</h1>
          <p className="text-body-md text-secondary mt-1">Create a new prospect profile in the CRM.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-label-sm text-on-surface-variant">First Name *</label>
                <input id="firstName" name="firstName" type="text" className={inputClass} placeholder="Enter first name" required
                  value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                {errors.firstName && <p className="text-body-sm text-error">{errors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-label-sm text-on-surface-variant">Last Name *</label>
                <input id="lastName" name="lastName" type="text" className={inputClass} placeholder="Enter last name" required
                  value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                {errors.lastName && <p className="text-body-sm text-error">{errors.lastName}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-label-sm text-on-surface-variant">Email Address</label>
                <input id="email" name="email" type="email" className={inputClass} placeholder="name@example.com"
                  value={form.email} onChange={(e) => set("email", e.target.value)} />
                {errors.email && <p className="text-body-sm text-error">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-label-sm text-on-surface-variant">Phone Number</label>
                <NumericInput id="phone" name="phone" mode="phone" className={inputClass} placeholder="+1 (555) 000-0000"
                  value={form.phone} onChange={(v) => set("phone", v)} />
                {errors.phone && <p className="text-body-sm text-error">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Lead Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="leadStatus" className="text-label-sm text-on-surface-variant">Lead Status</label>
                <AppSelect instanceId="leadStatus"
                  value={form.leadStatus} onChange={(v) => set("leadStatus", (v ?? "New") as typeof form.leadStatus)}
                  options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="source" className="text-label-sm text-on-surface-variant">Lead Source</label>
                <AppSelect instanceId="source"
                  value={form.source} onChange={(v) => set("source", (v ?? "Website") as typeof form.source)}
                  options={SOURCE_OPTIONS.map((s) => ({ value: s, label: s }))} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="agentId" className="text-label-sm text-on-surface-variant">Assigned Agent</label>
                <AppSelect instanceId="agentId" isSearchable isClearable placeholder="Unassigned"
                  value={form.agentId || null} onChange={(v) => set("agentId", v ?? "")}
                  options={agents.map((a) => ({ value: String(a.id), label: a.name }))} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Property Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="budget" className="text-label-sm text-on-surface-variant">Budget Range</label>
                <input id="budget" name="budget" type="text" className={inputClass} placeholder="e.g. $800k - $1M"
                  value={form.budget} onChange={(e) => set("budget", e.target.value)} />
                {errors.budget && <p className="text-body-sm text-error">{errors.budget}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="propertyType" className="text-label-sm text-on-surface-variant">Property Type</label>
                <AppSelect instanceId="propertyType"
                  value={form.propertyType} onChange={(v) => set("propertyType", (v ?? "Any") as typeof form.propertyType)}
                  options={PROPERTY_TYPE_OPTIONS.map((t) => ({ value: t, label: t }))} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="preferredLocation" className="text-label-sm text-on-surface-variant">Location Preferences</label>
                <input id="preferredLocation" name="preferredLocation" type="text" className={inputClass} placeholder="e.g. Downtown, Suburbs"
                  value={form.preferredLocation} onChange={(e) => set("preferredLocation", e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="notes" className="text-label-sm text-on-surface-variant">Additional Notes</label>
                <textarea id="notes" name="notes" rows={4} className={inputClass} placeholder="Enter any specific requirements or background info..."
                  value={form.notes} onChange={(e) => set("notes", e.target.value)}></textarea>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Link href="/leads" className="px-6 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
              {saving ? "Saving..." : "Save Lead"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
