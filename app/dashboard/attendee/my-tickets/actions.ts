'use server';

import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/drizzle';
import { tickets, events } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export async function getMyTickets() {
  console.log('Fetching tickets for user');
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    console.error('Unauthorized access attempt');
    throw new Error('Unauthorized');
  }

  console.log(`Fetching tickets for user ID: ${session.user.id}`);
  const myTickets = await db
    .select({
      ticket: {
        id: tickets.id,
        ticketType: tickets.ticketType,
        purchaseDate: tickets.purchaseDate,
        status: tickets.status,
        ticketNumber: tickets.ticketNumber,
        seatNumber: tickets.seatNumber,
        qrCode: tickets.qrCode,
      },
      event: {
        id: events.id,
        name: events.name,
        startDate: events.startDate,
        endDate: events.endDate,
        venue: events.venue,
        bannerImage: events.bannerImage,
      },
    })
    .from(tickets)
    .innerJoin(events, eq(tickets.eventId, events.id))
    .where(eq(tickets.attendeeId, parseInt(session.user.id)))
    .orderBy(desc(tickets.purchaseDate));

  console.log(`Found ${myTickets.length} tickets for user`);
  return myTickets;
}
