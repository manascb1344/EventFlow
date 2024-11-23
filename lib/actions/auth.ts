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
});

const organizerOnboardingSchema = z.object({
  organization: z.string().min(2),
  phoneNumber: z.string().min(10),
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
    console.log("Starting registration process");
    const validatedFields = registerSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      role: formData.get("role"),
    });

    console.log("Validated fields:", { ...validatedFields, password: "[REDACTED]" });

    const hashedPassword = await bcrypt.hash(validatedFields.password, 10);
    console.log("Password hashed successfully");

    if (validatedFields.role === "ATTENDEE") {
      console.log("Registering as ATTENDEE");
      const existingAttendee = await db.query.attendees.findFirst({
        where: (attendees, { eq }) => eq(attendees.email, validatedFields.email),
      });

      if (existingAttendee) {
        console.log("Attendee already exists");
        return { error: "User already exists" };
      }

      const [attendee] = await db.insert(attendees).values({
        email: validatedFields.email,
        password: hashedPassword,
        name: validatedFields.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: false,
      }).returning();

      console.log("Attendee created successfully:", attendee.id);
      revalidatePath("/");
      return { success: true, userId: attendee.id };

    } else {
      console.log("Registering as ORGANIZER");
      const existingOrganizer = await db.query.organizers.findFirst({
        where: (organizers, { eq }) => eq(organizers.email, validatedFields.email),
      });

      if (existingOrganizer) {
        console.log("Organizer already exists");
        return { error: "User already exists" };
      }

      const [organizer] = await db.insert(organizers).values({
        email: validatedFields.email,
        password: hashedPassword,
        name: validatedFields.name,
        organization: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: false,
      }).returning();

      console.log("Organizer created successfully:", organizer.id);
      revalidatePath("/");
      return { success: true, userId: organizer.id };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return { error: "Invalid input" };
    }
    console.error("Unexpected error during registration:", error);
    return { error: "Something went wrong" };
  }
}

export async function completeAttendeeOnboarding(formData: FormData) {
  try {
    console.log("Starting attendee onboarding process");
    const session = await getSession();
    if (!session?.user?.id || session?.user?.role !== "ATTENDEE") {
      console.log("Unauthorized attendee onboarding attempt");
      return { error: "Unauthorized" };
    }

    const validatedFields = attendeeOnboardingSchema.parse({
      phoneNumber: formData.get("phoneNumber"),
      interests: formData.get("interests"),
      dietaryRestrictions: formData.get("dietaryRestrictions"),
      preferredPaymentMethod: formData.get("preferredPaymentMethod"),
      notificationPreferences: formData.get("notificationPreferences") === "true",
    });

    console.log("Validated attendee onboarding fields:", validatedFields);

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

    console.log("Attendee onboarding completed successfully");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Attendee onboarding validation error:", error.errors);
      return { error: "Invalid input" };
    }
    console.error("Unexpected error during attendee onboarding:", error);
    return { error: "Something went wrong" };
  }
}

export async function completeOrganizerOnboarding(formData: FormData) {
  try {
    console.log("Starting organizer onboarding process");
    const session = await getSession();
    if (!session?.user?.id || session?.user?.role !== "ORGANIZER") {
      console.log("Unauthorized organizer onboarding attempt");
      return { error: "Unauthorized" };
    }

    const validatedFields = organizerOnboardingSchema.parse({
      organization: formData.get("organization"),
      phoneNumber: formData.get("phoneNumber"),
      bio: formData.get("bio"),
    });

    console.log("Validated organizer onboarding fields:", validatedFields);

    await db.update(organizers)
      .set({
        organization: validatedFields.organization,
        phoneNumber: validatedFields.phoneNumber,
        bio: validatedFields.bio || null,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(organizers.id, parseInt(session.user.id)));

    console.log("Organizer onboarding completed successfully");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Organizer onboarding validation error:", error.errors);
      return { error: "Invalid input" };
    }
    console.error("Unexpected error during organizer onboarding:", error);
    return { error: "Something went wrong" };
  }
}
