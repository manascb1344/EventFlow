'use server';

import { hash } from "bcryptjs";
import { db } from "@/lib/db/drizzle";
import { attendees } from "@/lib/db/schema";

type RegisterResponse = {
  success: boolean;
  message: string;
};

export async function register(
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

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
    const [newUser] = await db
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
