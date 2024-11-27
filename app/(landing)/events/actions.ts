"use server";

import { db } from "@/lib/db/drizzle";
import { events, savedEvents } from "@/lib/db/schema";
import { desc, eq, gte, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

export type Event = {
  id: number;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  ticketPrice: string;
  description: string;
  bannerImage: string | null;
  venue: string | null;
  seatsAvailable: number;
  isSaved?: boolean;
};

export async function getEvents(): Promise<Event[]> {
  const session = await getServerSession(authOptions);
  const now = new Date();
  
  const eventsList = await db
    .select({
      id: events.id,
      name: events.name,
      location: events.location,
      startDate: events.startDate,
      endDate: events.endDate,
      ticketPrice: events.ticketPrice,
      description: events.description,
      bannerImage: events.bannerImage,
      venue: events.venue,
      seatsAvailable: events.seatsAvailable,
    })
    .from(events)
    .where(gte(events.startDate, now))
    .orderBy(desc(events.startDate));

  if (session?.user?.role === 'ATTENDEE') {
    const savedEventIds = await db
      .select({ eventId: savedEvents.eventId })
      .from(savedEvents)
      .where(eq(savedEvents.attendeeId, +session.user.id));

    const savedEventIdSet = new Set(savedEventIds.map(e => e.eventId));
    
    return eventsList.map(event => ({
      ...event,
      isSaved: savedEventIdSet.has(event.id)
    }));
  }

  return eventsList.map(event => ({
    ...event,
    isSaved: false
  }));
}

export async function saveEvent(eventId: number) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ATTENDEE') {
    redirect('/auth/attendee/signin');
  }

  const existingSave = await db
    .select()
    .from(savedEvents)
    .where(
      and(
        eq(savedEvents.eventId, eventId),
        eq(savedEvents.attendeeId, +session.user.id)
      )
    );

  if (existingSave.length === 0) {
    await db.insert(savedEvents).values({
      eventId,
      attendeeId: +session.user.id,
    });
  }
}

export async function unsaveEvent(eventId: number) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ATTENDEE') {
    redirect('/auth/attendee/signin');
  }

  await db
    .delete(savedEvents)
    .where(
      and(
        eq(savedEvents.eventId, eventId),
        eq(savedEvents.attendeeId, +session.user.id)
      )
    );
}

export async function registerForEvent(eventId: number) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ATTENDEE') {
    redirect('/auth/attendee/signin');
  }

  // Check if event exists and has available seats
  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event.length || event[0].seatsAvailable <= 0) {
    throw new Error('Event is not available for registration');
  }

  // TODO: Add registration logic here once registration table is set up
  // For now, just decrease available seats
  await db
    .update(events)
    .set({ 
      seatsAvailable: event[0].seatsAvailable - 1 
    })
    .where(eq(events.id, eventId));

  return { success: true };
}

export async function getEventById(id: string) {
  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, parseInt(id)))
    .limit(1);

  if (!event.length) {
    return null;
  }

  return event[0];
}
