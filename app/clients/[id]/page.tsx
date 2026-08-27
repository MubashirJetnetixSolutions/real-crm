"use client";

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ApiClientError } from '../../lib/apiClient';
import { initialsOf } from '../../lib/format';
import { useToast } from '../../components/ToastProvider';
import type { ClientDealDTO, ClientDTO, ClientStatus } from '@/types/clients';

type ClientProfile = ClientDTO & { deals: ClientDealDTO[] };

const STATUS_BADGES: Record<ClientStatus, string> = {
  Active: "bg-tertiary/10 text-tertiary",
  Pending: "bg-secondary-container/50 text-secondary",
  Inactive: "bg-error/10 text-error",
};

const FALLBACK_DEAL_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";

function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dealBadge(deal: ClientDealDTO): { label: string; classes: string } {
  if (deal.outcome === "won") return { label: "Purchased", classes: "bg-tertiary/10 text-tertiary" };
  if (deal.outcome === "lost") return { label: "Lost", classes: "bg-surface-dim text-on-surface" };
  return { label: deal.stage ?? "In Progress", classes: "bg-primary/10 text-primary" };
}

export default function ClientProfilePage() {
  const params = useParams<{ id: string }>();
  const { error: toastError } = useToast();

  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const clientId = Number(params.id);
    if (!Number.isInteger(clientId) || clientId <= 0) {
      setMissing(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    api
      .get<ClientProfile>(`/api/clients/${clientId}`)
      .then(({ data }) => {
        if (!cancelled) setClient(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 404) {
          setMissing(true);
        } else {
          toastError(err instanceof ApiClientError ? err.message : "Failed to load the client.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (missing) notFound();

  if (loading || !client) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high" />
          <div className="w-14 h-14 rounded-full bg-surface-container-high" />
          <div className="space-y-2">
            <div className="h-6 w-56 bg-surface-container-high rounded" />
            <div className="h-3 w-36 bg-surface-container rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 h-56" />
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 h-40" />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 h-96" />
          </div>
        </div>
      </div>
    );
  }

  const badgeClasses = STATUS_BADGES[client.status] ?? STATUS_BADGES.Active;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div className="flex items-center gap-4">
            {client.avatarUrl ? (
              <img
                src={client.avatarUrl}
                alt={client.name}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-headline-md shrink-0">
                {initialsOf(client.name)}
              </div>
            )}
            <div>
              <h1 className="text-headline-lg text-on-surface flex items-center gap-3">
                {client.name}
                <span className={`px-2.5 py-1 ${badgeClasses} rounded-full text-[11px] font-bold uppercase tracking-wider hidden sm:inline-block`}>
                  {client.status}
                </span>
              </h1>
              <p className="text-body-md text-secondary mt-1">Client since {formatDate(client.joinedAt)}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/messages" className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">mail</span>
            Message
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
            <h2 className="text-headline-md text-on-surface mb-4">Contact Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant pb-2 gap-1">
                <span className="text-body-md text-secondary">Email</span>
                <span className="text-label-md text-on-surface">{client.email ?? "—"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant pb-2 gap-1">
                <span className="text-body-md text-secondary">Phone</span>
                <span className="text-label-md text-on-surface">{client.phone ?? "—"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2 gap-1">
                <span className="text-body-md text-secondary">Address</span>
                <span className="text-label-md text-on-surface sm:text-right max-w-[150px]">{client.address ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
            <h2 className="text-headline-md text-on-surface mb-4">Preferences</h2>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg mr-2 mb-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">badge</span>
                <span className="text-body-sm text-on-surface">{client.type}</span>
              </div>
              {client.intent && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg mr-2 mb-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">flag</span>
                  <span className="text-body-sm text-on-surface">{client.intent}</span>
                </div>
              )}
              {client.budget && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg mr-2 mb-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">payments</span>
                  <span className="text-body-sm text-on-surface">{client.budget}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
            <h2 className="text-headline-md text-on-surface mb-6">Property History</h2>

            <div className="space-y-4">
              {client.deals.map((deal) => {
                const badge = dealBadge(deal);
                return (
                  <div key={deal.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-outline-variant rounded-xl hover:bg-surface-bright transition-colors">
                    <div className="w-full sm:w-32 h-32 sm:h-24 rounded-lg bg-surface-container-high shrink-0 overflow-hidden">
                      <img src={deal.imageUrl ?? FALLBACK_DEAL_IMAGE} alt={deal.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-label-md text-on-surface">{deal.title}</h3>
                          <span className={`px-2 py-0.5 ${badge.classes} rounded text-[11px] font-bold uppercase tracking-wider`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-body-sm text-secondary mt-1">{deal.stage ?? "—"}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-label-md text-on-surface">{formatPrice(deal.price)}</span>
                        <span className="text-body-sm text-secondary">
                          {deal.outcome === "open" ? "Updated" : "Closed on"}: {formatDate(deal.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {client.deals.length === 0 && (
                <p className="text-body-md text-outline text-center py-8">No property history for this client yet.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
