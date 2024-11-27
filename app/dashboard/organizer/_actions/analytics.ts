import { db } from "@/lib/db/drizzle";
import { events, tickets, payments, surveys } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getEventStats(eventId: number) {
  try {
    const ticketStats = await db
      .select({
        totalTickets: sql`COUNT(*)`,
        confirmedTickets: sql`SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)`,
        usedTickets: sql`SUM(CASE WHEN status = 'used' THEN 1 ELSE 0 END)`,
        canceledTickets: sql`SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END)`,
      })
      .from(tickets)
      .where(eq(tickets.eventId, eventId));

    const revenueStats = await db
      .select({
        totalRevenue: sql`SUM(amount)`,
        refundedAmount: sql`SUM(CASE WHEN payment_status = 'refunded' THEN amount ELSE 0 END)`,
      })
      .from(payments)
      .innerJoin(tickets, eq(tickets.id, payments.ticketId))
      .where(eq(tickets.eventId, eventId));

    const surveyStats = await db
      .select({
        averageRating: sql`AVG(rating)`,
        totalResponses: sql`COUNT(*)`,
        averageSpeakerRating: sql`AVG(speaker_rating)`,
        averageVenueRating: sql`AVG(venue_rating)`,
        averageContentRating: sql`AVG(content_rating)`,
        recommendationRate: sql`AVG(CASE WHEN would_recommend THEN 1 ELSE 0 END)`,
      })
      .from(surveys)
      .where(eq(surveys.eventId, eventId));

    return {
      success: true,
      stats: {
        tickets: ticketStats[0],
        revenue: revenueStats[0],
        surveys: surveyStats[0],
      },
    };
  } catch (error) {
    console.error("Error fetching event stats:", error);
    return { error: "Failed to fetch event statistics" };
  }
}

export async function getOrganizerStats(organizerId: number) {
  try {
    const eventStats = await db
      .select({
        totalEvents: sql`COUNT(*)`,
        upcomingEvents: sql`SUM(CASE WHEN start_date > NOW() THEN 1 ELSE 0 END)`,
        completedEvents: sql`SUM(CASE WHEN event_status = 'completed' THEN 1 ELSE 0 END)`,
        canceledEvents: sql`SUM(CASE WHEN event_status = 'canceled' THEN 1 ELSE 0 END)`,
      })
      .from(events)
      .where(eq(events.organizerId, organizerId));

    const revenueStats = await db
      .select({
        totalRevenue: sql`SUM(amount)`,
        monthlyRevenue: sql`SUM(CASE WHEN payment_date >= NOW() - INTERVAL '30 days' THEN amount ELSE 0 END)`,
      })
      .from(payments)
      .innerJoin(tickets, eq(tickets.id, payments.ticketId))
      .innerJoin(events, eq(events.id, tickets.eventId))
      .where(eq(events.organizerId, organizerId));

    const attendeeStats = await db
      .select({
        totalAttendees: sql`COUNT(DISTINCT attendee_id)`,
      })
      .from(tickets)
      .innerJoin(events, eq(events.id, tickets.eventId))
      .where(eq(events.organizerId, organizerId));

    return {
      success: true,
      stats: {
        events: eventStats[0],
        revenue: revenueStats[0],
        attendees: attendeeStats[0],
      },
    };
  } catch (error) {
    console.error("Error fetching organizer stats:", error);
    return { error: "Failed to fetch organizer statistics" };
  }
}
