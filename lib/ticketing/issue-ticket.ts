import { db } from '@/lib/db/drizzle';
import { events, tickets, payments } from '@/lib/db/schema';
import { and, eq, gt, sql } from 'drizzle-orm';

export class NoSeatsError extends Error {
  constructor() {
    super('No seats available for this event');
    this.name = 'NoSeatsError';
  }
}

type IssueTicketInput = {
  eventId: number;
  attendeeId: number;
  attendeeName: string;
  paymentIntentId: string;
  checkoutSessionId: string;
  amount: string;
};

export async function issueTicket(input: IssueTicketInput) {
  return db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(tickets)
      .where(eq(tickets.stripePaymentIntentId, input.paymentIntentId))
      .limit(1);

    if (existing.length > 0) {
      return { ticket: existing[0], created: false };
    }

    const reserved = await tx
      .update(events)
      .set({ seatsAvailable: sql`${events.seatsAvailable} - 1` })
      .where(and(eq(events.id, input.eventId), gt(events.seatsAvailable, 0)))
      .returning({ id: events.id });

    if (reserved.length === 0) {
      throw new NoSeatsError();
    }

    const [ticket] = await tx
      .insert(tickets)
      .values({
        eventId: input.eventId,
        attendeeId: input.attendeeId,
        ticketType: 'REGULAR',
        status: 'CONFIRMED',
        attendeeName: input.attendeeName,
        ticketNumber: `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        stripePaymentIntentId: input.paymentIntentId,
      })
      .returning();

    await tx.insert(payments).values({
      ticketId: ticket.id,
      amount: input.amount,
      paymentMethod: 'CARD',
      paymentStatus: 'COMPLETED',
      transactionId: input.checkoutSessionId,
      stripeSessionId: input.checkoutSessionId,
      stripePaymentIntentId: input.paymentIntentId,
    });

    return { ticket, created: true };
  });
}
