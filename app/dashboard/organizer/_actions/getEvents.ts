'use server';

import { db } from "@/lib/db/drizzle";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function getEvents() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const organizerId = parseInt(session.user.id);

    const organizerEvents = await db.query.events.findMany({
      where: eq(events.organizerId, organizerId),
      orderBy: (events, { desc }) => [desc(events.createdAt)],
      with: {
        tickets: true,
      },
    });

    // Calculate tickets sold for each event
    const eventsWithTickets = organizerEvents.map(event => ({
      ...event,
      ticketsSold: event.tickets?.filter(ticket => 
        ticket.status === "confirmed" || ticket.status === "used"
      ).length || 0,
    }));

    return { events: eventsWithTickets };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { error: "Internal server error" };
  }
}
