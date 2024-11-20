"use server";

import { db } from "@/lib/db/drizzle";
import { events } from "@/lib/db/schema";
import { desc, gte } from "drizzle-orm";

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
};

export async function getEvents(): Promise<Event[]> {
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
      bannerImage: events.bannerImage,
      venue: events.venue,
      seatsAvailable: events.seatsAvailable,
    })
    .from(events)
    .where(gte(events.startDate, now))
    .orderBy(desc(events.startDate));
}
