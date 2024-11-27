'use server'

import { db } from '@/lib/db/drizzle'
import { savedEvents, events } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth/authOptions'

export async function getSavedEvents() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ATTENDEE') {
    redirect('/auth/attendee/signin')
  }

  const savedEventsList = await db
    .select({
      id: events.id,
      name: events.name,
      location: events.location,
      startDate: events.startDate,
      endDate: events.endDate,
      description: events.description,
      ticketPrice: events.ticketPrice,
      seatsAvailable: events.seatsAvailable,
      savedEventId: savedEvents.id,
      bannerImage: events.bannerImage,
      venue: events.venue
    })
    .from(savedEvents)
    .innerJoin(events, eq(events.id, savedEvents.eventId))
    .where(eq(savedEvents.attendeeId, +session.user.id))
    .orderBy(events.startDate)

  return savedEventsList
}

export async function removeSavedEvent(savedEventId: number) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ATTENDEE') {
    redirect('/auth/attendee/signin')
  }

  try {
    await db
      .delete(savedEvents)
      .where(eq(savedEvents.id, savedEventId))
  } catch (error) {
    console.error('Error removing saved event:', error)
    throw new Error('Failed to remove saved event')
  }
}
