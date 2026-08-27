"use client";

import type { ApiFailure, ApiSuccess, PaginationMeta } from "@/types/api";

/** Error thrown for non-2xx API responses, carrying field-level validation errors. */
export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
  }
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown
): Promise<{ data: T; meta?: PaginationMeta }> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) {
    return { data: undefined as T };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new ApiClientError(res.status, "Unexpected server response");
  }

  if (!res.ok) {
    const err = (json as ApiFailure).error;
    throw new ApiClientError(res.status, err?.message ?? "Request failed", err?.fields);
  }

  const success = json as ApiSuccess<T>;
  return { data: success.data, meta: success.meta };
}

export const api = {
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, body?: unknown) => request<T>("POST", url, body),
  put: <T>(url: string, body?: unknown) => request<T>("PUT", url, body),
  patch: <T>(url: string, body?: unknown) => request<T>("PATCH", url, body),
  delete: <T>(url: string) => request<T>("DELETE", url),
};
