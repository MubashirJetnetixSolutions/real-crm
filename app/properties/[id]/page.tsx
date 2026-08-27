"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getPropertyById, getPropertyGallery } from "@/lib/mockData";

function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, goNext, goPrev]);

  const preview = images.slice(0, 5);
  const extraCount = images.length - 5;

  return (
    <>
      <div className="md:hidden relative rounded-xl overflow-hidden h-[280px]">
        <img src={images[0]} alt={title} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-on-surface px-4 py-2 rounded-lg text-label-sm font-semibold shadow-lg hover:bg-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          Show all {images.length} photos
        </button>
      </div>

      <div className="hidden md:block relative rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] lg:h-[480px]">
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 relative overflow-hidden group"
          >
            <img src={images[0]} alt={`${title} — main`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
          </button>
          {preview.slice(1).map((src, i) => {
            const index = i + 1;
            const isLast = index === 4 && extraCount > 0;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                className="relative overflow-hidden group"
              >
                <img src={src} alt={`${title} — photo ${index + 1}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                {isLast && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white font-semibold text-label-md backdrop-blur-[1px]">
                    +{extraCount} more
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="absolute bottom-5 right-5 flex items-center gap-2 bg-white text-on-surface px-4 py-2.5 rounded-lg text-label-sm font-semibold shadow-[0px_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.2)] transition-shadow"
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          Show all photos
        </button>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 text-white shrink-0">
            <p className="text-label-md font-semibold">
              {activeIndex + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center px-16 min-h-0">
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[28px]">chevron_left</span>
            </button>
            <img
              src={images[activeIndex]}
              alt={`${title} — photo ${activeIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[28px]">chevron_right</span>
            </button>
          </div>

          <div className="shrink-0 px-6 pb-6 pt-2 overflow-x-auto custom-scrollbar">
            <div className="flex gap-2 justify-center min-w-min">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    i === activeIndex ? "border-white opacity-100" : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const property = getPropertyById(id);

  if (!property) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-headline-lg text-on-surface mb-4">Property Not Found</h1>
        <Link href="/properties" className="text-primary font-semibold hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  const images = getPropertyGallery(property);
  const statusClass =
    property.status === "Available"
      ? "bg-tertiary/10 text-tertiary"
      : property.status === "Sold"
      ? "bg-error/10 text-error"
      : "bg-primary/10 text-primary";

  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/properties" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-headline-lg text-on-surface flex items-center gap-3">
              {property.title}
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider hidden sm:inline-block ${statusClass}`}>
                {property.status}
              </span>
            </h1>
            <p className="text-body-md text-secondary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {property.location}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" className="p-2 bg-surface-container border border-outline-variant rounded-lg text-secondary hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">edit</span>
            <span className="hidden sm:inline">Edit Listing</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <PropertyGallery images={images} title={property.title} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
            <h2 className="text-headline-md text-on-surface mb-4">Description</h2>
            <p className="text-body-md text-secondary leading-relaxed">
              {property.description ||
                `A stunning ${property.type.toLowerCase()} located in ${property.location}. This property features ${property.beds} bedrooms, ${property.baths} bathrooms, and ${property.sqft.toLocaleString()} sq ft of living space.`}
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
            <h2 className="text-headline-md text-on-surface mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "bed", label: "Bedrooms", value: property.beds },
                { icon: "bathtub", label: "Bathrooms", value: property.baths },
                { icon: "square_foot", label: "Sq Ft", value: property.sqft.toLocaleString() },
                { icon: "category", label: "Type", value: property.type },
              ].map((item) => (
                <div key={item.label} className="bg-surface-container-low rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-primary mb-2">{item.icon}</span>
                  <p className="text-label-sm text-outline">{item.label}</p>
                  <p className="text-label-md font-bold text-on-surface">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">Listing Price</p>
            <p className="text-headline-xl font-bold text-primary">{property.price}</p>
            <p className="text-body-sm text-secondary mt-2">ID: {property.propId}</p>
            <p className="text-body-sm text-secondary">Listed: {property.listedDate}</p>
            <button type="button" className="w-full mt-6 py-3 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">
              Schedule Viewing
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
            <h2 className="text-headline-md text-on-surface mb-4">Listing Agent</h2>
            <div className="flex items-center gap-3">
              <img src={property.agentAvatar} alt={property.agentName} className="w-12 h-12 rounded-full object-cover border-2 border-primary-fixed" />
              <div>
                <p className="text-label-md font-bold text-on-surface">{property.agentName}</p>
                <p className="text-body-sm text-secondary">{property.agentRole}</p>
              </div>
            </div>
            <Link href="/messages" className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Contact Agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
