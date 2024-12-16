'use server';

import { db } from "@/lib/db/drizzle";
import { attendees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface AttendeeProfileData {
  name: string;
  phoneNumber: string | null;
  interests: string | null;
  dietaryRestrictions: string | null;
  preferredPaymentMethod: string | null;
  notificationPreferences: boolean;
  profileImage: string | null;
}

export async function updateAttendeeProfile(attendeeId: number | undefined, formData: FormData) {
  if (!attendeeId) {
    throw new Error("Attendee ID is required");
  }

  try {
    const data: Partial<Omit<typeof attendees.$inferInsert, 'name'> & { name?: string }> = {
      name: formData.get("name")?.toString() || undefined,
      phoneNumber: formData.get("phoneNumber")?.toString() || undefined,
      interests: formData.get("interests")?.toString() || undefined,
      dietaryRestrictions: formData.get("dietaryRestrictions")?.toString() || undefined,
      preferredPaymentMethod: formData.get("preferredPaymentMethod")?.toString() || undefined,
      notificationPreferences: formData.get("notificationPreferences") === "true",
      profileImage: formData.get("profileImage")?.toString() || undefined,
    };

    if (!data.name?.trim()) {
      throw new Error("Name is required");
    }

    await db.update(attendees)
      .set(data)
      .where(eq(attendees.id, attendeeId));
    
    revalidatePath("/dashboard/attendee/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating attendee profile:", error);
    throw error;
  }
}

export async function getAttendeeProfile(attendeeId: number | undefined) {
  if (!attendeeId) {
    throw new Error("Attendee ID is required");
  }

  try {
    const attendee = await db.query.attendees.findFirst({
      where: eq(attendees.id, attendeeId),
    });
    
    if (!attendee) {
      throw new Error("Attendee not found");
    }

    return attendee;
  } catch (error) {
    console.error("Error fetching attendee profile:", error);
    throw error;
  }
}
