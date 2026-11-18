'use server';

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db/drizzle";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function getEvents() {
  try {
    const session = await getServerSession(authOptions);

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

    const eventsWithTickets = organizerEvents.map(event => {
      const ticketsSold = event.tickets?.filter(ticket =>
        ticket.status === "CONFIRMED" || ticket.status === "USED"
      ).length || 0;
      return { ...event, ticketsSold };
    });

    return { events: eventsWithTickets };
  } catch {
    return { error: "Internal server error" };
  }
}
