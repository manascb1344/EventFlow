import Stripe from 'stripe';
import { stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { events, tickets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, generatePaymentSuccessEmail, generatePaymentErrorEmail } from '@/lib/email';
import { issueTicket } from '@/lib/ticketing/issue-ticket';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';
export const maxDuration = 10;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log(' Webhook endpoint hit');
  
  if (!webhookSecret) {
    console.error(' STRIPE_WEBHOOK_SECRET is not set in environment variables');
    return NextResponse.json(
      { error: 'Server misconfigured - webhook secret not set' },
      { status: 500 }
    );
  }

  console.log(' Webhook secret is configured');
  const payload = await request.text();
  console.log(' Received payload length:', payload.length);
  
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    console.error(' No stripe-signature header found in webhook request');
    return NextResponse.json(
      { error: 'No stripe signature found in request' },
      { status: 400 }
    );
  }
  
  console.log(' Stripe signature found:', signature.substring(0, 20) + '...');
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    console.log('Webhook event constructed successfully:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.', err },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log('Webhook processed successfully');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    await sendErrorEmail(event, error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const { eventId, attendeeId } = session.metadata || {};

  if (!eventId || !attendeeId) {
    throw new Error('Missing eventId or attendeeId in session metadata');
  }

  const paymentIntentId = session.payment_intent as string;
  const eventRow = await db.query.events.findFirst({
    where: eq(events.id, parseInt(eventId, 10)),
  });

  if (!eventRow) {
    throw new Error('Event not found');
  }

  const { ticket, created } = await issueTicket({
    eventId: eventRow.id,
    attendeeId: parseInt(attendeeId, 10),
    attendeeName: session.customer_details?.name || '',
    paymentIntentId,
    checkoutSessionId: session.id,
    amount: eventRow.ticketPrice,
  });

  if (created) {
    await sendSuccessEmail(session, eventRow, ticket);
  }
}

async function sendSuccessEmail(session: Stripe.Checkout.Session, event: typeof events.$inferSelect, ticket: typeof tickets.$inferSelect) {
  try {
    let invoiceUrl: string | undefined;
    if (session.invoice) {
      const invoice = await stripe.invoices.retrieve(session.invoice as string);
      invoiceUrl = invoice.hosted_invoice_url || undefined;
    }

    const emailContent = generatePaymentSuccessEmail(
      session.customer_details?.name || 'Valued Customer',
      Math.round(Number(event.ticketPrice) * 100),
      ticket.ticketNumber,
      invoiceUrl,
      {
        name: event.name,
        date: event.startDate ? new Date(event.startDate).toLocaleDateString('en-US') : 'TBA',
        location: event.venue || 'TBA'
      }
    );

    await sendEmail({
      to: session.customer_details?.email || '',
      ...emailContent,
      attachments: invoiceUrl ? [{
        filename: 'invoice.pdf',
        path: invoiceUrl
      }] : undefined
    });

    console.log('Success email sent with invoice and event details');
  } catch (emailError) {
    console.error('Failed to send success email:', emailError);
    // Continue execution even if email fails
  }
}

async function sendErrorEmail(event: Stripe.Event, error: unknown) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const emailContent = generatePaymentErrorEmail(
        session.customer_details?.name || 'Valued Customer',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      await sendEmail({
        to: session.customer_details?.email || '',
        ...emailContent
      });
    } catch (emailError) {
      console.error('Failed to send error email:', emailError);
    }
  }
}