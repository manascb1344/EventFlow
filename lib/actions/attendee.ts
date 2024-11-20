"use server"

import { db } from "@/lib/db/drizzle";
import { eq, and, gte, lte } from "drizzle-orm";
import { events, tickets, attendees } from "@/lib/db/schema";

export async function getAttendeeStats(attendeeId: number) {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  // Get upcoming events (events in the next 30 days that the attendee has tickets for)
  const upcomingEvents = await db
    .select({ id: events.id })
    .from(events)
    .innerJoin(tickets, eq(tickets.eventId, events.id))
    .where(
      and(
        eq(tickets.attendeeId, attendeeId),
        gte(events.startDate, now),
        lte(events.startDate, thirtyDaysFromNow),
        eq(tickets.status, "CONFIRMED")
      )
    );

  // Get total registered events
  const registeredEvents = await db
    .select({ id: events.id })
    .from(events)
    .innerJoin(tickets, eq(tickets.eventId, events.id))
    .where(
      and(
        eq(tickets.attendeeId, attendeeId),
        eq(tickets.status, "CONFIRMED")
      )
    );

  // Get nearby events (all upcoming events)
  const nearbyEvents = await db
    .select({ id: events.id })
    .from(events)
    .where(
      and(
        gte(events.startDate, now)
      )
    );

  return {
    upcomingEventsCount: upcomingEvents.length,
    registeredEventsCount: registeredEvents.length,
    nearbyEventsCount: nearbyEvents.length,
  };
}

export async function getUpcomingEvents(attendeeId: number) {
  const now = new Date();
  
  return await db
    .select({
      id: events.id,
      name: events.name,
      location: events.location,
      startDate: events.startDate,
      endDate: events.endDate,
      ticketPrice: events.ticketPrice,
      description: events.description,
    })
    .from(events)
    .innerJoin(tickets, eq(tickets.eventId, events.id))
    .where(
      and(
        eq(tickets.attendeeId, attendeeId),
        gte(events.startDate, now),
        eq(tickets.status, "CONFIRMED")
      )
    )
    .orderBy(events.startDate)
    .limit(5);
}

export async function getAttendeeProfile(attendeeId: number) {
  return await db.query.attendees.findFirst({
    where: eq(attendees.id, attendeeId),
    columns: {
      name: true,
      email: true,
      phoneNumber: true,
      interests: true,
      dietaryRestrictions: true,
      preferredPaymentMethod: true,
      notificationPreferences: true,
      profileImage: true,
    },
  });
}
