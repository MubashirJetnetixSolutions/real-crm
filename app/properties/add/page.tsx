"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FileUpload, { type UploadedFile } from "../../components/FileUpload";
import AppSelect from "../../components/forms/AppSelect";
import CurrencyInput from "../../components/forms/CurrencyInput";
import NumericInput from "../../components/forms/NumericInput";
import { saveCustomProperty, type PropertyData } from "../../lib/mockData";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBeqvM3MNA6SQ5E-u6Kyi9gBSIeFCafsgDdX_11R0bDblYxY7ANkqf9iqtPFLzO-wr9a6RyZST-1aEX0j46tMi-KNZW1F5-QGuPTopzgr9u1qXDRYFBVVgM6Ud4mxyzezlFrC7oL8gacXd5DDiACbgah0frKY3Ga-8FPxr9G3z6g6UENGhHycP0CXQY5uV_R_ow3TgASnnU42gm29d_BU02u0m8iwvyOIl98nPqXtMf__kbaVhMO4IF1I4NDOCQvGe7c_I9DylbxDst";

export default function AddPropertyPage() {
  const router = useRouter();
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    status: "Available",
    price: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    beds: "",
    baths: "",
    sqft: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const priceNum = parseFloat(form.price) || 0;
    const gallery = images.map((img) => img.url);
    const imageUrl = gallery[0] ?? DEFAULT_IMAGE;
    const location = [form.address, form.city, form.state, form.zip].filter(Boolean).join(", ");
    const id = `prop-${Date.now()}`;

    const property: PropertyData = {
      id,
      propId: `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: form.title,
      location: location || "Location TBD",
      type: form.type || "Apartment",
      price: `$${priceNum.toLocaleString()}`,
      priceNum,
      beds: parseInt(form.beds) || 0,
      baths: parseFloat(form.baths) || 0,
      sqft: parseInt(form.sqft) || 0,
      status: form.status === "Sold" || form.status === "Rented" ? form.status : "Available",
      listedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      imageUrl,
      gallery: gallery.length > 0 ? gallery : undefined,
      agentName: "Sarah Chen",
      agentRole: "Listing Expert",
      agentAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDEHpX5_iNKm4nCyQszPiGWV-GVf4DhSGBtlIFaZrJjREnggT_VrlYBCaowdVms9NeHIAXbO_gKSv2CGQZG1yx4VOY7jA8Yawiy73bS3mYZD_aNCDL7PS2tC0ODQ9HD-RzHl3V0ghAE9hr12wd4H0bLOMbSEmJ8BGkKltmjFDnG-HSgXPy7xou-k6LjN7Ny3BTrxNj6d5kcOInxDZ9HiVAkr53rKApKKGp0ucR23XGE6F9Z8QUoDaAIyZ-t1DrbSkjGimF_Y1QOpSSh",
      description: form.description || undefined,
    };

    saveCustomProperty(property);
    router.push(`/properties/${id}`);
  }

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/properties" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-headline-lg text-on-surface">Add New Property</h1>
          <p className="text-body-md text-secondary mt-1">Create a new real estate listing with photos.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-label-sm text-on-surface-variant">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Modern Downtown Loft"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-label-sm text-on-surface-variant">Description</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClass}
                  placeholder="Enter detailed property description..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Property Type *</label>
                <AppSelect instanceId="property-type" placeholder="Select type..." isClearable
                  value={form.type || null}
                  onChange={(v) => setForm((f) => ({ ...f, type: v ?? "" }))}
                  options={["Single Family", "Condo", "Townhouse", "Penthouse", "Multi-Family", "Land"].map((t) => ({ value: t, label: t }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Listing Status *</label>
                <AppSelect instanceId="property-status"
                  value={form.status}
                  onChange={(v) => setForm((f) => ({ ...f, status: v ?? "Available" }))}
                  options={["Available", "Coming Soon", "Under Offer", "Sold", "Rented"].map((s) => ({ value: s, label: s }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Price ($) *</label>
                <CurrencyInput
                  required
                  value={form.price}
                  onChange={(v) => setForm((f) => ({ ...f, price: v }))}
                  className={inputClass}
                  placeholder="$0"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-label-sm text-on-surface-variant">Street Address *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className={inputClass}
                  placeholder="123 Main St"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">City *</label>
                <input type="text" required value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">State/Province *</label>
                <input type="text" required value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">ZIP / Postal Code *</label>
                <NumericInput required value={form.zip} onChange={(v) => setForm((f) => ({ ...f, zip: v }))} maxLength={10} className={inputClass} ariaLabel="ZIP / Postal Code" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className={inputClass} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Property Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Bedrooms</label>
                <NumericInput value={form.beds} onChange={(v) => setForm((f) => ({ ...f, beds: v }))} className={inputClass} placeholder="0" ariaLabel="Bedrooms" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Bathrooms</label>
                <NumericInput mode="decimal" value={form.baths} onChange={(v) => setForm((f) => ({ ...f, baths: v }))} className={inputClass} placeholder="0" ariaLabel="Bathrooms" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm text-on-surface-variant">Square Footage (sqft)</label>
                <NumericInput value={form.sqft} onChange={(v) => setForm((f) => ({ ...f, sqft: v }))} className={inputClass} placeholder="0" ariaLabel="Square Footage" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Property Photos</h2>
            <FileUpload
              variant="dropzone"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              maxFiles={12}
              maxSize={5 * 1024 * 1024}
              files={images}
              onChange={setImages}
              onError={setUploadError}
              label="Upload Property Images"
              hint="Drag and drop images here, or click to browse. Upload one or multiple photos (up to 12, 5MB each)."
              buttonLabel="Select Files"
            />
            {uploadError && (
              <p className="text-body-sm text-error mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {uploadError}
              </p>
            )}
            {images.length > 0 && (
              <p className="text-body-sm text-tertiary mt-2 font-medium">
                {images.length} photo{images.length !== 1 ? "s" : ""} ready to publish — first image will be the cover photo
              </p>
            )}
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Link href="/properties" className="px-6 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm disabled:opacity-70"
            >
              {submitting ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
