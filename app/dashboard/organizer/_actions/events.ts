'use server';

import { db } from "@/lib/db/drizzle";
import { events, tickets, EventStatus } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { z } from "zod";

const eventInputSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  ticketPrice: z.coerce.number().nonnegative(),
  seatsAvailable: z.coerce.number().int().positive(),
  venue: z.string().optional(),
  venueCapacity: z.coerce.number().int().nonnegative(),
  isPublic: z.boolean(),
  registrationDeadline: z.coerce.date(),
});

export async function createEvent(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ORGANIZER') {
      return { error: 'Unauthorized' };
    }

    const parsed = eventInputSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      location: formData.get('location'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      ticketPrice: formData.get('ticketPrice'),
      seatsAvailable: formData.get('seatsAvailable'),
      venue: formData.get('venue'),
      venueCapacity: formData.get('venueCapacity') ?? 0,
      isPublic: formData.get('isPublic') === 'true',
      registrationDeadline: formData.get('registrationDeadline'),
    });

    if (!parsed.success) {
      return { error: 'Invalid event details' };
    }

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      ticketPrice: formData.get("ticketPrice") as string,
      seatsAvailable: parseInt(formData.get("seatsAvailable") as string),
      organizerId: Number(session.user.id),
      eventStatus: "PUBLISHED" as const,
      venue: parsed.data.venue ?? null,
      venueCapacity: parsed.data.venueCapacity,
      isPublic: parsed.data.isPublic,
      registrationDeadline: parsed.data.registrationDeadline,
    };

    await db.insert(events).values(data);
    revalidatePath("/dashboard/organizer/events");
    return { success: true };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
}

export async function updateEvent(eventId: number, formData: FormData) {
  try {
    const data = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      location: String(formData.get("location") ?? ""),
      startDate: new Date(String(formData.get("startDate") ?? "")),
      endDate: new Date(String(formData.get("endDate") ?? "")),
      ticketPrice: String(formData.get("ticketPrice") ?? "0"),
      seatsAvailable: Number(formData.get("seatsAvailable") ?? 0),
      eventStatus: String(formData.get("eventStatus") ?? "PUBLISHED") as keyof typeof EventStatus,
      venue: formData.get("venue") as string,
      venueCapacity: parseInt(formData.get("venueCapacity") as string),
      isPublic: formData.get("isPublic") === "true",
      registrationDeadline: new Date(formData.get("registrationDeadline") as string),
    };

    await db.update(events).set(data).where(eq(events.id, eventId));
    revalidatePath("/dashboard/organizer/events");
    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { error: "Failed to update event" };
  }
}

export async function deleteEvent(eventId: number) {
  try {
    await db.delete(events).where(eq(events.id, eventId));
    revalidatePath("/dashboard/organizer/events");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { error: "Failed to delete event" };
  }
}

export async function publishEvent(eventId: number) {
  try {
    await db.update(events)
      .set({ eventStatus: "PUBLISHED" })
      .where(eq(events.id, eventId));
    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Error publishing event:", error);
    return { error: "Failed to publish event" };
  }
}

export async function getEventTickets(eventId: number) {
  try {
    const eventTickets = await db.query.tickets.findMany({
      where: eq(tickets.eventId, eventId),
      with: {
        attendee: true
      }
    });
    
    return { tickets: eventTickets };
  } catch (error) {
    console.error("Error fetching event tickets:", error);
    return { error: "Failed to fetch tickets" };
  }
}

export async function getEventAttendees(eventId: number) {
  try {
    const eventAttendees = await db.query.tickets.findMany({
      where: eq(tickets.eventId, eventId),
      with: {
        attendee: {
          columns: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            profileImage: true
          }
        }
      }
    });
    
    return { attendees: eventAttendees.map(ticket => ticket.attendee) };
  } catch (error) {
    console.error("Error fetching event attendees:", error);
    return { error: "Failed to fetch attendees" };
  }
}
