import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db/drizzle";
import { attendees, UserRole } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string;
    role: keyof typeof UserRole;
    email: string;
    name: string;
    onboardingCompleted: boolean;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: keyof typeof UserRole;
      onboardingCompleted: boolean;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: keyof typeof UserRole;
    onboardingCompleted: boolean;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const email = credentials.email;
        const password = credentials.password as string;
        const claimedRole = credentials.role?.toUpperCase() as keyof typeof UserRole | undefined;

        // Resolve the role from the account when the caller does not claim one.
        // Prefer the attendee match on an email shared by both tables.
        if (claimedRole !== "ORGANIZER") {
          const attendee = await db.query.attendees.findFirst({
            where: (attendees, { eq }) => eq(attendees.email, email),
          });

          if (attendee && await bcrypt.compare(password, attendee.password ?? "")) {
            return {
              id: attendee.id.toString(),
              email: attendee.email,
              name: attendee.name,
              role: "ATTENDEE" as const,
              onboardingCompleted: attendee.onboardingCompleted,
            };
          }
        }

        if (claimedRole !== "ATTENDEE") {
          const organizer = await db.query.organizers.findFirst({
            where: (organizers, { eq }) => eq(organizers.email, email),
          });

          if (organizer && await bcrypt.compare(password, organizer.password ?? "")) {
            return {
              id: organizer.id.toString(),
              email: organizer.email,
              name: organizer.name,
              role: "ORGANIZER" as const,
              onboardingCompleted: organizer.onboardingCompleted,
            };
          }
        }

        throw new Error("Invalid credentials");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {

      if (!user?.email) {
        return false;
      }

      // Only allow Google sign-in for attendees
      if (account?.provider === "google") {
        // Check if user is trying to sign in as organizer
        const existingOrganizer = await db.query.organizers.findFirst({
          where: (organizers, { eq }) => eq(organizers.email, user.email),
        });

        if (existingOrganizer) {
          return false;
        }

        // Handle attendee Google sign-in
        const existingAttendee = await db.query.attendees.findFirst({
          where: (attendees, { eq }) => eq(attendees.email, user.email),
        });

        if (!existingAttendee) {
          // Create new attendee account
          const [newAttendee] = await db.insert(attendees).values({
            email: user.email,
            name: user.name || "",
            password: "", // No password for Google sign-in
            createdAt: new Date(),
            updatedAt: new Date(),
            onboardingCompleted: false,
          }).returning();

          user.id = newAttendee.id.toString();
          user.role = "ATTENDEE";
          user.onboardingCompleted = false;
        } else {
          user.id = existingAttendee.id.toString();
          user.role = "ATTENDEE";
          user.onboardingCompleted = existingAttendee.onboardingCompleted;
        }
      }

      return true;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.onboardingCompleted = token.onboardingCompleted
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.onboardingCompleted = user.onboardingCompleted
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.onboardingCompleted = session.user.onboardingCompleted
      }

      return token
    },
  },
  pages: {
    signIn: '/auth/attendee/signin',
    newUser: '/auth/attendee/signup',
  },
  session: {
    strategy: "jwt",
  }
};
