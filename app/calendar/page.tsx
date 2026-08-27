"use client";

import { useState, useMemo } from "react";
import Header from "../components/Header";
import AppSelect from "../components/forms/AppSelect";
import AppDatePicker from "../components/forms/AppDatePicker";

interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: string;
  type: "Viewing" | "Meeting" | "Call" | "Reminder";
  property?: string;
  notes?: string;
}

const initialEvents: Event[] = [
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

// Helper to format date object to YYYY-MM-DD
const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// ── Create Event Modal ────────────────────────────────────────────────────────
function CreateEventModal({
  selectedDate,
  onClose,
  onAdd,
}: {
  selectedDate: string;
  onClose: () => void;
  onAdd: (event: Event) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    date: selectedDate,
    time: "10:00",
    duration: "1 hr",
    type: "Viewing" as "Viewing" | "Meeting" | "Call" | "Reminder",
    property: "",
    notes: "",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: form.title,
      date: form.date,
      time: form.time,
      duration: form.duration,
      type: form.type,
      property: form.property || undefined,
      notes: form.notes || undefined,
    };
    setSaved(true);
    setTimeout(() => {
      onAdd(newEvent);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">Schedule New Event</h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">Add to your calendar team schedule.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>
        {saved ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <p className="text-headline-md font-bold text-on-surface">Event Scheduled!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Event Title *</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Property Viewing"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Date *</label>
                <AppDatePicker
                  required
                  value={form.date || null}
                  onChange={(v) => setForm((f) => ({ ...f, date: v ?? "" }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Time *</label>
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Duration</label>
                <AppSelect
                  instanceId="event-duration"
                  value={form.duration}
                  onChange={(v) => setForm((f) => ({ ...f, duration: v ?? "1 hr" }))}
                  options={["30 min", "1 hr", "1.5 hr", "2 hr", "All Day"].map((d) => ({ value: d, label: d }))}
                />
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Type</label>
                <AppSelect
                  instanceId="event-type"
                  value={form.type}
                  onChange={(v) => setForm((f) => ({ ...f, type: (v ?? "Meeting") as Event["type"] }))}
                  options={["Viewing", "Meeting", "Call", "Reminder"].map((t) => ({ value: t, label: t }))}
                />
              </div>
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Property Link (Optional)</label>
              <input
                type="text"
                value={form.property}
                onChange={(e) => setForm((f) => ({ ...f, property: e.target.value }))}
                placeholder="e.g. Skyline Penthouse"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
              />
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                placeholder="Details of the scheduled event..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-outline"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Schedule</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 9)); // Default to June 9, 2026
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // Month tracker starting June 2026
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Calendar Grid builder
  const gridDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    const days: Date[] = [];

    // Prev month overflow days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevTotalDays - i));
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month overflow days (fill grid of 42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }, [currentMonth]);

  const monthYearLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const selectedDateKey = formatDateKey(selectedDate);

  // Events on the selected day
  const selectedDayEvents = events.filter((e) => e.date === selectedDateKey);

  // Color mappings for event types
  const typeStyles = {
    Viewing: "border-primary text-primary bg-primary/5",
    Meeting: "border-secondary text-secondary bg-secondary/5",
    Call: "border-tertiary text-tertiary bg-tertiary/5",
    Reminder: "border-error text-error bg-error/5",
  };

  return (
    <>
      <Header title="Calendar" subtitle="Manage your schedule, viewings, and meetings" />

      {showAddEvent && (
        <CreateEventModal
          selectedDate={selectedDateKey}
          onClose={() => setShowAddEvent(false)}
          onAdd={(e) => setEvents((prev) => [...prev, e])}
        />
      )}

      <main className="p-gutter flex-1 flex flex-col space-y-gutter max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-headline-lg text-on-surface font-bold">Schedule</h2>
            <p className="text-body-sm text-on-surface-variant">
              Sync viewings, meetings, and follow-up reminders.
            </p>
          </div>
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Visual Month Grid (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-headline-md font-bold text-on-surface">{monthYearLabel}</h3>
              <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded hover:bg-surface-container-high text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentMonth(new Date(2026, 5, 1));
                    setSelectedDate(new Date(2026, 5, 9));
                  }}
                  className="px-2.5 py-1 text-label-sm font-semibold rounded hover:bg-surface-container-high transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded hover:bg-surface-container-high text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2 border-b border-outline-variant/20 pb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <span key={day} className="text-label-sm font-bold text-on-surface-variant">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-2 flex-1">
              {gridDays.map((day, idx) => {
                const isSelected = formatDateKey(day) === selectedDateKey;
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const dayKey = formatDateKey(day);
                const dayEvents = events.filter((e) => e.date === dayKey);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all select-none ${
                      isSelected
                        ? "border-primary bg-primary/[0.03] ring-1 ring-primary"
                        : "border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-low"
                    } ${isCurrentMonth ? "" : "opacity-40"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-label-md font-semibold ${
                          isSelected ? "text-primary font-bold" : "text-on-surface"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>

                    {/* Event Dots/Mini Labels */}
                    <div className="space-y-1 overflow-hidden max-h-12">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none truncate max-w-full ${
                            typeStyles[ev.type]
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] font-bold text-outline text-right px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agenda view (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 shadow-sm flex flex-col">
            <h3 className="text-headline-md font-bold text-on-surface mb-1">Agenda</h3>
            <p className="text-body-sm text-on-surface-variant mb-6">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div className="flex-1 overflow-y-auto space-y-4">
              {selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline-variant mb-4">
                    <span className="material-symbols-outlined text-[24px]">event_busy</span>
                  </div>
                  <p className="text-label-md text-on-surface font-semibold">No Scheduled Events</p>
                  <p className="text-body-sm text-outline mt-1 max-w-[200px]">
                    Click "+ New Event" to schedule an activity for this day.
                  </p>
                </div>
              ) : (
                selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-xl border-l-4 bg-surface-container-low border border-outline-variant/15 flex flex-col space-y-2 hover:shadow-sm transition-all ${
                      ev.type === "Viewing"
                        ? "border-l-primary"
                        : ev.type === "Meeting"
                        ? "border-l-secondary"
                        : ev.type === "Call"
                        ? "border-l-tertiary"
                        : "border-l-error"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            typeStyles[ev.type]
                          }`}
                        >
                          {ev.type}
                        </span>
                        <h4 className="text-label-md font-bold text-on-surface mt-2">{ev.title}</h4>
                      </div>
                      <span className="text-[11px] text-outline font-semibold">
                        {ev.time} ({ev.duration})
                      </span>
                    </div>

                    {ev.property && (
                      <div className="flex items-center gap-1 text-body-sm text-primary font-medium">
                        <span className="material-symbols-outlined text-[14px]">home_work</span>
                        {ev.property}
                      </div>
                    )}

                    {ev.notes && (
                      <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        {ev.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
