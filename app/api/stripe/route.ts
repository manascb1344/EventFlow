'use server';

import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { events } from "@/lib/db/schema";
import { stripe } from "@/lib/payments/stripe";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("[POST] Unauthorized: No user session");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, parseInt(eventId)),
    });

    if (!event) {
      console.log("[POST] Event not found");
      return new NextResponse("Event not found", { status: 404 });
    }

    if (event.seatsAvailable <= 0 || event.eventStatus !== "PUBLISHED" || event.isPublic === false) {
      return new NextResponse("Event is not available for registration", { status: 409 });
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
