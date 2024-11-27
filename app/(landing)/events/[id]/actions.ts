'use server';

import { db } from "@/lib/db/drizzle";
import { events, tickets, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/payments/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

export type PaymentProcessResult = {
  success: boolean;
  error?: string;
  event?: any;
  ticket?: any;
};

export async function processPayment(
  sessionId: string,
  eventId: string
): Promise<PaymentProcessResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify the payment session
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (!stripeSession) {
      return { success: false, error: "Invalid session" };
    }

    // Get event details
    const event = await db.query.events.findFirst({
      where: eq(events.id, parseInt(eventId)),
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Check if ticket already exists
    const existingTicket = await db.query.tickets.findFirst({
      where: eq(tickets.stripePaymentIntentId, stripeSession.payment_intent as string),
    });

    if (existingTicket) {
      return { success: true, event, ticket: existingTicket };
    }

    if (stripeSession.payment_status === "paid") {
      // Create ticket
      const [ticket] = await db.insert(tickets).values({
        eventId: event.id,
        attendeeId: parseInt(session.user.id),
        ticketType: "REGULAR",
        status: "CONFIRMED",
        attendeeName: session.user.name || "",
        ticketNumber: `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        stripePaymentIntentId: stripeSession.payment_intent as string,
      }).returning();

      // Create payment record
      await db.insert(payments).values({
        ticketId: ticket.id,
        amount: event.ticketPrice,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        transactionId: sessionId,
        stripeSessionId: sessionId,
        stripePaymentIntentId: stripeSession.payment_intent as string,
      });

      // Update event seats
      await db
        .update(events)
        .set({ seatsAvailable: event.seatsAvailable - 1 })
        .where(eq(events.id, event.id));

      return { success: true, event, ticket };
    }

    return { success: false, error: "Payment not completed" };
  } catch (error) {
    console.error("Error processing payment:", error);
    return { success: false, error: "Payment processing failed" };
  }
}

export async function createStripeSession(eventId: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return { error: "Event not found" };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.name,
              description: event.description,
              images: event.bannerImage ? [event.bannerImage] : undefined,
            },
            unit_amount: Math.round(parseFloat(event.ticketPrice.toString()) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`,
      metadata: {
        eventId: eventId.toString(),
        attendeeId: session.user.id,
      },
    });

    return { url: stripeSession.url };
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return { error: "Failed to create checkout session" };
  }
}
