import { db } from "@/lib/db/drizzle";
import { tickets, events } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(ticketId: number, status: string) {
  try {
    await db.update(tickets)
      .set({ status })
      .where(eq(tickets.id, ticketId));
    revalidatePath("/dashboard/organizer/events");
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { error: "Failed to update ticket status" };
  }
}

export async function assignSeat(ticketId: number, seatNumber: string) {
  try {
    await db.update(tickets)
      .set({ seatNumber })
      .where(eq(tickets.id, ticketId));
    return { success: true };
  } catch (error) {
    console.error("Error assigning seat:", error);
    return { error: "Failed to assign seat" };
  }
}

export async function getEventTickets(eventId: number) {
  try {
    const eventTickets = await db.query.tickets.findMany({
      where: eq(tickets.eventId, eventId),
      with: {
        attendee: true,
      },
    });
    return { tickets: eventTickets };
  } catch (error) {
    console.error("Error fetching event tickets:", error);
    return { error: "Failed to fetch event tickets" };
  }
}

export async function validateTicket(ticketNumber: string) {
  try {
    const ticket = await db.query.tickets.findFirst({
      where: eq(tickets.ticketNumber, ticketNumber),
    });
    
    if (!ticket) {
      return { error: "Ticket not found" };
    }

    if (ticket.status === "USED") {
      return { error: "Ticket has already been used" };
    }

    await db.update(tickets)
      .set({ status: "USED" })
      .where(eq(tickets.ticketNumber, ticketNumber));

    return { success: true, ticket };
  } catch (error) {
    console.error("Error validating ticket:", error);
    return { error: "Failed to validate ticket" };
  }
}
