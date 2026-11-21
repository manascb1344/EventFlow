"use client";

import { useEffect, useMemo, useState } from "react";
import { EventCard, type Event } from "@/components/events/event-card";
import { EventsFilters, type EventFilters } from "./_components/events-filters";
import { EventsHeader } from "./_components/events-header";
import { getEvents, saveEvent, unsaveEvent } from "./actions";

const emptyFilters: EventFilters = { search: "", location: "", date: undefined };

function matchesFilters(event: Event, filters: EventFilters): boolean {
  const search = filters.search.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();

  if (search && !`${event.name} ${event.description}`.toLowerCase().includes(search)) {
    return false;
  }
  if (location && !`${event.location} ${event.venue ?? ""}`.toLowerCase().includes(location)) {
    return false;
  }
  if (filters.date) {
    const eventStart = new Date(event.startDate);
    const sameDay =
      eventStart.getFullYear() === filters.date.getFullYear() &&
      eventStart.getMonth() === filters.date.getMonth() &&
      eventStart.getDate() === filters.date.getDate();
    if (!sameDay) return false;
  }
  return true;
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<EventFilters>(emptyFilters);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getEvents();
        const serializedEvents = events.map((event) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }));
        setUpcomingEvents(serializedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const visibleEvents = useMemo(
    () => upcomingEvents.filter((event) => matchesFilters(event, appliedFilters)),
    [upcomingEvents, appliedFilters]
  );

  const hasFilters =
    appliedFilters.search.trim() !== "" ||
    appliedFilters.location.trim() !== "" ||
    appliedFilters.date !== undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <EventsHeader />
      <div className="mt-8 grid grid-cols-1 gap-8">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <aside className="w-full md:w-64">
            <EventsFilters
              filters={filters}
              onChange={setFilters}
              onApply={() => setAppliedFilters(filters)}
            />
          </aside>
          <main className="flex-1">
            {loading ? (
              <div>Loading events...</div>
            ) : visibleEvents.length === 0 ? (
              <div className="rounded-md border border-white/10 p-8 text-center">
                <p className="text-sm text-[#8b93a3]">
                  {hasFilters ? "No events match these filters." : "No upcoming events yet."}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    className="mt-4 text-sm font-medium text-p1 underline underline-offset-4"
                    onClick={() => {
                      setFilters(emptyFilters);
                      setAppliedFilters(emptyFilters);
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSaveToggle={saveEvent}
                    onUnsaveToggle={unsaveEvent}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
