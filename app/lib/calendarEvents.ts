export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: "Viewing" | "Meeting" | "Call" | "Reminder";
  property?: string;
  notes?: string;
}

const STORAGE_KEY = "drimpact_calendar_events";

export const defaultCalendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Viewing: Skyline Penthouse",
    date: "2026-06-09",
    time: "14:00",
    duration: "1 hr",
    type: "Viewing",
    property: "Skyline Penthouse",
    notes: "Site viewing with Robert Chen. Show him the rooftop deck.",
  },
  {
    id: "e2",
    title: "Negotiation Meeting: Sarah Jenkins",
    date: "2026-06-12",
    time: "10:00",
    duration: "1.5 hr",
    type: "Meeting",
    property: "Oakwood Estate",
    notes: "Review final draft contract and deposit terms.",
  },
  {
    id: "e3",
    title: "Follow-up: Julian Rossi",
    date: "2026-06-09",
    time: "16:30",
    duration: "30 min",
    type: "Call",
    notes: "Check on financing pre-approval documents.",
  },
  {
    id: "e4",
    title: "Property Listing Review",
    date: "2026-06-15",
    time: "09:00",
    duration: "1 hr",
    type: "Reminder",
    notes: "Update pricing for Malibu Villa.",
  },
];

function readStoredEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalendarEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCalendarEvents(): CalendarEvent[] {
  const stored = readStoredEvents();
  if (stored.length === 0) return defaultCalendarEvents;

  const defaultIds = new Set(defaultCalendarEvents.map((e) => e.id));
  const overrides = new Map(
    stored.filter((e) => defaultIds.has(e.id)).map((e) => [e.id, e])
  );
  const custom = stored.filter((e) => !defaultIds.has(e.id));
  const mergedDefaults = defaultCalendarEvents.map((e) => overrides.get(e.id) ?? e);
  return [...mergedDefaults, ...custom];
}

export function addCalendarEvent(event: CalendarEvent): void {
  if (typeof window === "undefined") return;
  const stored = readStoredEvents();
  const defaultIds = new Set(defaultCalendarEvents.map((e) => e.id));
  const custom = stored.filter((e) => !defaultIds.has(e.id));
  custom.push(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

export function updateCalendarEvent(event: CalendarEvent): void {
  if (typeof window === "undefined") return;
  const isDefault = defaultCalendarEvents.some((e) => e.id === event.id);
  const stored = readStoredEvents();
  const defaultIds = new Set(defaultCalendarEvents.map((e) => e.id));
  let custom = stored.filter((e) => !defaultIds.has(e.id));

  if (isDefault) {
    custom = custom.filter((e) => e.id !== event.id);
    custom.push(event);
  } else {
    const idx = custom.findIndex((e) => e.id === event.id);
    if (idx >= 0) custom[idx] = event;
    else custom.push(event);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

export function deleteCalendarEvent(id: string): void {
  if (typeof window === "undefined") return;
  const stored = readStoredEvents();
  const defaultIds = new Set(defaultCalendarEvents.map((e) => e.id));
  const custom = stored.filter((e) => !defaultIds.has(e.id) && e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}
