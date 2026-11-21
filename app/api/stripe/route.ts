'use server';

import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { events } from "@/lib/db/schema";
import { stripe } from "@/lib/payments/stripe";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { issueTicket } from "@/lib/ticketing/issue-ticket";
import { sendEmail, generatePaymentSuccessEmail } from "@/lib/email";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ATTENDEE") {
      return new NextResponse("Only attendee accounts can register for events", { status: 403 });
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, parseInt(eventId)),
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (event.seatsAvailable <= 0 || event.eventStatus !== "PUBLISHED" || event.isPublic === false) {
      return new NextResponse("Event is not available for registration", { status: 409 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL;
    if (!origin) {
      return new NextResponse("Missing NEXT_PUBLIC_APP_URL", { status: 500 });
    }

    if (process.env.DEMO_CHECKOUT === "true") {
      const token = randomUUID();
      const paymentIntentId = `demo_pi_${token}`;
      const checkoutSessionId = `demo_cs_${token}`;

      const { ticket } = await issueTicket({
        eventId: event.id,
        attendeeId: Number(session.user.id),
        attendeeName: session.user.name || "",
        paymentIntentId,
        checkoutSessionId,
        amount: event.ticketPrice,
      });

      if (session.user.email) {
        const email = generatePaymentSuccessEmail(
          session.user.name || "Valued Customer",
          Math.round(Number(event.ticketPrice) * 100),
          ticket.ticketNumber,
          undefined,
          {
            name: event.name,
            date: event.startDate ? new Date(event.startDate).toLocaleDateString("en-US") : "TBA",
            location: event.venue || event.location,
          }
        );
        try {
          await sendEmail({ to: session.user.email, ...email });
        } catch (error) {
          console.error("[DEMO_EMAIL_ERROR]", error);
        }
      }

      return NextResponse.json({
        url: `${origin}/events/${eventId}/success?session_id=${checkoutSessionId}&demo=1`,
      });
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
      success_url: `${origin}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/${eventId}`,
      metadata: {
        eventId: eventId,
        attendeeId: session.user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
