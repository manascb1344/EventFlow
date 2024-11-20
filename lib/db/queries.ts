import { desc, and, eq, isNull, or } from 'drizzle-orm';
import { db } from './drizzle';
import { attendees, organizers } from './schema';
import { UserRole } from './schema';

export async function getUserByStripeCustomerId(customerId: string, role: keyof typeof UserRole) {
  if (role === 'ORGANIZER') {
    const organizer = await db
      .select()
      .from(organizers)
      .where(eq(organizers.stripeCustomerId, customerId))
      .limit(1);

    return organizer.length > 0 ? { ...organizer[0], role: 'ORGANIZER' as const } : null;
  } else {
    const attendee = await db
      .select()
      .from(attendees)
      .where(eq(attendees.stripeCustomerId, customerId))
      .limit(1);

    return attendee.length > 0 ? { ...attendee[0], role: 'ATTENDEE' as const } : null;
  }
}

export async function updateUserSubscription(
  userId: number,
  role: keyof typeof UserRole,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  const table = role === 'ORGANIZER' ? organizers : attendees;
  await db
    .update(table)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(table.id, userId));
}