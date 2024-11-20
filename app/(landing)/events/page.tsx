"use client";

import { Suspense, useEffect, useState } from "react";
import { EventCard } from "./_components/event-card";
import { EventsFilters } from "./_components/events-filters";
import { EventsHeader } from "./_components/events-header";
import { Event, getEvents } from "./actions";

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getEvents();
        console.log(events);
        setUpcomingEvents(events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <EventsHeader />
      <div className="mt-8 grid grid-cols-1 gap-8">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <aside className="w-full md:w-64">
            <EventsFilters />
          </aside>
          <main className="flex-1">
            <Suspense fallback={<div>Loading events...</div>}>
              {loading ? (
                <div>Loading events...</div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
