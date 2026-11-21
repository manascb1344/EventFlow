'use server';

import { db } from '@/lib/db/drizzle';
import { attendees } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { revalidatePath } from 'next/cache';

export type AttendeeSettings = {
  emailNotifications: boolean;
  marketingEmails: boolean;
  publicProfile: boolean;
  showAttendance: boolean;
};

export async function getAttendeeSettings(): Promise<AttendeeSettings | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ATTENDEE') return null;

  const attendee = await db.query.attendees.findFirst({
    where: eq(attendees.id, Number(session.user.id)),
  });
  if (!attendee) return null;

  return {
    emailNotifications: attendee.notificationPreferences ?? true,
    marketingEmails: attendee.marketingEmails ?? false,
    publicProfile: attendee.publicProfile ?? false,
    showAttendance: attendee.showAttendance ?? false,
  };
}

export async function updateAttendeeSettings(settings: AttendeeSettings) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ATTENDEE') {
    return { error: 'Unauthorized' };
  }

  await db.update(attendees).set({
    notificationPreferences: settings.emailNotifications,
    marketingEmails: settings.marketingEmails,
    publicProfile: settings.publicProfile,
    showAttendance: settings.showAttendance,
    updatedAt: new Date(),
  }).where(eq(attendees.id, Number(session.user.id)));

  revalidatePath('/dashboard/attendee/settings');
  return { success: true };
}
