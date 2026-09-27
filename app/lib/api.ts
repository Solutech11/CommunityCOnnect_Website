import type { ApiFailure, ApiSuccess, Event, Page, TicketOrder, TicketType } from "../types";

export const API_URL = (import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api/v1" : "https://communty-connect-api.onrender.com/api/v1")
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message: string, public status: number, public code: string, public requestId?: string) {
    super(message);
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  let payload: ApiSuccess<T> | ApiFailure;
  try {
    payload = await response.json() as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new ApiError("The server returned an unreadable response.", response.status, "INVALID_RESPONSE");
  }
  if (!response.ok || !payload.success) {
    const failure = payload as ApiFailure;
    throw new ApiError(failure.error?.message || "The request could not be completed.", response.status, failure.error?.code || "API_ERROR", failure.requestId);
  }
  return payload.data;
}

export function queryString(values: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.toString();
}

export function discoverEvents(section: "trending" | "recent" | "past", state?: string, page = 1, limit = 12) {
  return request<Page<Event>>(`/events/discover?${queryString({ section, state, page, limit })}`);
}

export function listEvents(state?: string, search?: string, page = 1) {
  return request<Page<Event>>(`/events?${queryString({ state, search, page, limit: 12 })}`);
}

export function getEvent(id: string) {
  return request<{ event: Event; ticketTypes: TicketType[] }>(`/events/${encodeURIComponent(id)}`);
}

export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function orderEvent(order: TicketOrder): Event {
  return order.eventId;
}
