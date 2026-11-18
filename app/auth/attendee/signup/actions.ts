'use server';

import { hash } from "bcryptjs";
import { db } from "@/lib/db/drizzle";
import { attendees } from "@/lib/db/schema";
import { z } from "zod";

type RegisterResponse = {
  success: boolean;
  message: string;
};

export async function register(
  email: string,
  password: string
): Promise<RegisterResponse> {
  const parsed = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }).safeParse({ email, password });

  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a valid email and a password of at least 8 characters",
    };
  }

  try {

    // Check if user already exists
    const existingUser = await db.query.attendees.findFirst({
      where: (attendees, { eq }) => eq(attendees.email, email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    await db
      .insert(attendees)
      .values({
        email,
        password: hashedPassword,
        name: email.split("@")[0], // Temporary name from email
        onboardingCompleted: false,
      })
      .returning();

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Something went wrong during registration",
    };
  }
}
