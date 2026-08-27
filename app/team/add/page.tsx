"use client";

import Link from "next/link";
import { useState } from "react";
import FileUpload from "../../components/FileUpload";
import AppSelect from "../../components/forms/AppSelect";
import NumericInput from "../../components/forms/NumericInput";

export default function AddTeamMemberPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    phone: "",
    role: "",
    office: "Downtown Branch",
    access: "Standard User (Agent)",
    status: "Active",
  });
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/team" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-headline-lg text-on-surface">Add Team Member</h1>
          <p className="text-body-md text-secondary mt-1">Create a new agent or staff profile.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
        <form className="space-y-8">
          
          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">First Name *</label>
                <input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Last Name *</label>
                <input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Email Address *</label>
                <input type="email" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Phone Number *</label>
                <NumericInput mode="phone" required value={fields.phone} onChange={(v) => setFields((f) => ({ ...f, phone: v }))} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" ariaLabel="Phone Number" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Role & Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Job Title / Role *</label>
                <AppSelect instanceId="team-role" placeholder="Select a role..." isSearchable
                  value={fields.role || null} onChange={(v) => setFields((f) => ({ ...f, role: v ?? "" }))}
                  options={["Senior Broker", "Property Specialist", "Real Estate Agent", "Junior Agent", "Administrative Staff"].map((r) => ({ value: r, label: r }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Office Location</label>
                <AppSelect instanceId="team-office"
                  value={fields.office} onChange={(v) => setFields((f) => ({ ...f, office: v ?? "Downtown Branch" }))}
                  options={["Downtown Branch", "Westside Office", "Suburban Branch"].map((o) => ({ value: o, label: o }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">System Access Level</label>
                <AppSelect instanceId="team-access"
                  value={fields.access} onChange={(v) => setFields((f) => ({ ...f, access: v ?? "Standard User (Agent)" }))}
                  options={["Standard User (Agent)", "Manager", "Administrator"].map((a) => ({ value: a, label: a }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Status</label>
                <AppSelect instanceId="team-status"
                  value={fields.status} onChange={(v) => setFields((f) => ({ ...f, status: v ?? "Active" }))}
                  options={["Active", "Inactive"].map((s) => ({ value: s, label: s }))} />
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Profile Picture</h2>
            <FileUpload
              variant="avatar"
              accept="image/jpeg,image/png,image/gif,image/webp"
              maxSize={2 * 1024 * 1024}
              previewUrl={photo}
              buttonLabel="Upload Photo"
              hint="Recommended size: 400×400px. Max size: 2MB."
              onPreviewChange={(url) => {
                setPhoto(url);
                setUploadError(null);
              }}
              onError={setUploadError}
            />
            {uploadError && (
              <p className="text-body-sm text-error mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {uploadError}
              </p>
            )}
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Link href="/team" className="px-6 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm">
              Add Member
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
