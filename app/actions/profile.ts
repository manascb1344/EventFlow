'use server'

import { authOptions } from "@/lib/auth/authOptions"
import { db } from "@/lib/db/drizzle"
import { getServerSession } from "next-auth"
import { attendees } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function getProfileImage() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null

    const attendee = await db.query.attendees.findFirst({
      where: eq(attendees.email, session.user.email),
      columns: {
        profileImage: true
      }
    })

    return attendee?.profileImage || null
  } catch (error) {
    console.error('Error fetching profile image:', error)
    return null
  }
}
