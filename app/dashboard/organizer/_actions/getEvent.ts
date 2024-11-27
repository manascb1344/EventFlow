'use server';

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db/drizzle";
import { events } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function getEvent(eventId: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const organizerId = parseInt(session.user.id);

    const event = await db.query.events.findFirst({
      where: and(
        eq(events.id, eventId),
        eq(events.organizerId, organizerId)
      ),
      with: {
        tickets: true,
      },
    });

    if (!event) {
      return { error: "Event not found" };
    }

    // Calculate tickets sold
    const ticketsSold = event.tickets?.filter(ticket => 
      ticket.status === "CONFIRMED" || ticket.status === "USED"
    ).length || 0;

    return {
      event: {
        ...event,
        ticketsSold,
      },
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return { error: "Internal server error" };
  }
}
