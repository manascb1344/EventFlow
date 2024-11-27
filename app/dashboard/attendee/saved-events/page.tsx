"use client";

import { Suspense, useEffect, useState } from "react";
import { EventCard, type Event } from "@/components/events/event-card";
import { getSavedEvents, removeSavedEvent } from "./actions";
import { Loader2 } from "lucide-react";

export default function SavedEventsPage() {
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSavedEvents() {
    try {
      const events = await getSavedEvents();
      setSavedEvents(events.map((event): Event => ({
        ...event,
        isSaved: true
      })));
    } catch (error) {
      console.error("Failed to fetch saved events:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSavedEvents();
  }, []);

  const handleUnsave = async (savedEventId: number) => {
    try {
      await removeSavedEvent(savedEventId);
      setSavedEvents(prev => prev.filter(event => event.savedEventId !== savedEventId));
    } catch (error) {
      console.error("Failed to unsave event:", error);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Saved Events</h1>
      <Suspense fallback={
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : savedEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">You haven&apos;t saved any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showSaveButton={true}
                onUnsaveToggle={(savedEventId: number) => savedEventId ? handleUnsave(savedEventId) : Promise.resolve()}
                onSaveToggle={(eventId: number) => Promise.resolve()}
              />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
