"use client";

import { useState } from "react";
import Link from "next/link";

export interface Property {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number | string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  status: "Available" | "Sold" | "Rented" | "Under Offer" | string;
  agentName: string;
  agentRole: string;
  agentAvatar: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group card-hover bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 border border-outline-variant/30">
      <div className="relative h-64 overflow-hidden image-zoom">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500"
          src={property.imageUrl}
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-label-sm font-semibold shadow-lg uppercase tracking-wider ${
              property.status === "Available"
                ? "bg-tertiary text-on-tertiary"
                : property.status === "Sold"
                ? "bg-secondary text-on-secondary"
                : property.status === "Rented"
                ? "bg-error text-on-error"
                : "bg-primary-container text-on-primary-container"
            }`}
          >
            {property.status}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite
                ? "bg-white text-error"
                : "bg-white/20 text-white hover:bg-white hover:text-error"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(`${window.location.origin}/properties/${property.id}`);
              alert("Link copied to clipboard!");
            }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-headline-md font-bold text-on-surface line-clamp-1">{property.title}</h3>
            <div className="flex items-center gap-1 text-on-surface-variant text-body-sm mt-1">
              <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>
          <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-label-sm shrink-0">
            {property.type}
          </span>
        </div>
        <div className="text-headline-md font-bold text-primary">
          {typeof property.price === "number"
            ? `$${property.price.toLocaleString()}`
            : property.price}
        </div>
        <div className="flex justify-between items-center py-4 border-y border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">bed</span>
            <span className="text-label-sm text-on-surface">{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">bathtub</span>
            <span className="text-label-sm text-on-surface">{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">square_foot</span>
            <span className="text-label-sm text-on-surface">{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-surface overflow-hidden shrink-0">
              <img
                alt={property.agentName}
                className="w-full h-full object-cover"
                src={property.agentAvatar}
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-label-sm text-on-surface leading-none font-bold">{property.agentName}</span>
              <span className="text-body-sm text-on-surface-variant mt-1">{property.agentRole}</span>
            </div>
          </div>
          <Link
            href={`/properties/${property.id}`}
            className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-all text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
