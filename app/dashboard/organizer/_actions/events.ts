import { db } from "@/lib/db/drizzle";
import { events, type Event } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      ticketPrice: parseFloat(formData.get("ticketPrice") as string),
      seatsAvailable: parseInt(formData.get("seatsAvailable") as string),
      organizerId: parseInt(formData.get("organizerId") as string),
      eventStatus: "draft",
      venue: formData.get("venue") as string,
      venueCapacity: parseInt(formData.get("venueCapacity") as string),
      isPublic: formData.get("isPublic") === "true",
      registrationDeadline: new Date(formData.get("registrationDeadline") as string),
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
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      ticketPrice: parseFloat(formData.get("ticketPrice") as string),
      seatsAvailable: parseInt(formData.get("seatsAvailable") as string),
      eventStatus: formData.get("eventStatus") as string,
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
      .set({ eventStatus: "published" })
      .where(eq(events.id, eventId));
    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Error publishing event:", error);
    return { error: "Failed to publish event" };
  }
}
