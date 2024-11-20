"use server"

import { db } from "@/lib/db/drizzle";
import { attendees, organizers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

const getSession = async () => {
  return await getServerSession(authOptions);
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["ORGANIZER", "ATTENDEE"]),
  organization: z.string().optional(),
});

const organizerOnboardingSchema = z.object({
  organization: z.string().min(2),
  bio: z.string().optional(),
});

const attendeeOnboardingSchema = z.object({
  phoneNumber: z.string().min(10),
  interests: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  preferredPaymentMethod: z.string().optional(),
  notificationPreferences: z.boolean().optional(),
});

export async function register(formData: FormData) {
  try {
    const validatedFields = registerSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      role: formData.get("role"),
      organization: formData.get("organization"),
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

    if (validatedFields.role === "ATTENDEE") {
      // Check if attendee exists
      const existingAttendee = await db.query.attendees.findFirst({
        where: (attendees, { eq }) => eq(attendees.email, validatedFields.email),
      });

      if (existingAttendee) {
        return { error: "User already exists" };
      }

      // Create attendee
      const [attendee] = await db.insert(attendees).values({
        email: validatedFields.email,
        password: hashedPassword,
        name: validatedFields.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: false,
      }).returning();

      revalidatePath("/");
      return { success: true, userId: attendee.id };

    } else {
      // Check if organizer exists
      const existingOrganizer = await db.query.organizers.findFirst({
        where: (organizers, { eq }) => eq(organizers.email, validatedFields.email),
      });

      if (existingOrganizer) {
        return { error: "User already exists" };
      }

      if (!validatedFields.organization && validatedFields.role === "ORGANIZER") {
        return { error: "Organization name is required for organizers" };
      }

      // Create organizer
      const [organizer] = await db.insert(organizers).values({
        email: validatedFields.email,
        password: hashedPassword,
        name: validatedFields.name,
        organization: validatedFields.organization || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: false,
      }).returning();

      revalidatePath("/");
      return { success: true, userId: organizer.id };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid input" };
    }
    return { error: "Something went wrong" };
  }
}

export async function completeAttendeeOnboarding(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session?.user?.role !== "ATTENDEE") {
      return { error: "Unauthorized" };
    }

    const validatedFields = attendeeOnboardingSchema.parse({
      phoneNumber: formData.get("phoneNumber"),
      interests: formData.get("interests"),
      dietaryRestrictions: formData.get("dietaryRestrictions"),
      preferredPaymentMethod: formData.get("preferredPaymentMethod"),
      notificationPreferences: formData.get("notificationPreferences") === "true",
    });

    await db.update(attendees)
      .set({
        phoneNumber: validatedFields.phoneNumber,
        interests: validatedFields.interests || null,
        dietaryRestrictions: validatedFields.dietaryRestrictions || null,
        preferredPaymentMethod: validatedFields.preferredPaymentMethod || null,
        notificationPreferences: validatedFields.notificationPreferences ?? true,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(attendees.id, parseInt(session.user.id)));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Attendee onboarding error:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input" };
    }
    return { error: "Something went wrong" };
  }
}

export async function completeOrganizerOnboarding(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session?.user?.role !== "ORGANIZER") {
      return { error: "Unauthorized" };
    }

    const validatedFields = organizerOnboardingSchema.parse({
      organization: formData.get("organization"),
      bio: formData.get("bio"),
    });

    await db.update(organizers)
      .set({
        organization: validatedFields.organization,
        bio: validatedFields.bio || null,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(organizers.id, parseInt(session.user.id)));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Organizer onboarding error:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input" };
    }
    return { error: "Something went wrong" };
  }
}
