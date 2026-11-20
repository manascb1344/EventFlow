'use server';

import { db } from "@/lib/db/drizzle";
import { events, tickets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/payments/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { issueTicket } from "@/lib/ticketing/issue-ticket";

export type PaymentProcessResult = {
  success: boolean;
  error?: string;
  event?: typeof events.$inferSelect;
  ticket?: typeof tickets.$inferSelect;
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

    if (sessionId.startsWith("demo_cs_")) {
      const demoPaymentIntentId = sessionId.replace("demo_cs_", "demo_pi_");
      const [demoTicket] = await db
        .select()
        .from(tickets)
        .where(eq(tickets.stripePaymentIntentId, demoPaymentIntentId))
        .limit(1);
      const event = await db.query.events.findFirst({
        where: eq(events.id, parseInt(eventId, 10)),
      });

      if (!event || !demoTicket) {
        return { success: false, error: "Demo ticket not found" };
      }

      return { success: true, event, ticket: demoTicket };
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (!stripeSession || stripeSession.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" };
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, parseInt(eventId, 10)),
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    const { ticket } = await issueTicket({
      eventId: event.id,
      attendeeId: parseInt(session.user.id, 10),
      attendeeName: session.user.name || "",
      paymentIntentId: stripeSession.payment_intent as string,
      checkoutSessionId: sessionId,
      amount: event.ticketPrice,
    });

    return { success: true, event, ticket };
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

    if (event.seatsAvailable <= 0 || event.eventStatus !== "PUBLISHED" || event.isPublic === false) {
      return { error: "Event is not available for registration" };
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
