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
        console.log("Authorizing credentials:", { email: credentials?.email, role: credentials?.role });

        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          console.log("Missing credentials");
          throw new Error("Invalid credentials");
        }

        const role = credentials.role.toUpperCase() as keyof typeof UserRole;

        // Organizers can only use credentials provider
        if (role === "ORGANIZER") {
          const organizer = await db.query.organizers.findFirst({
            where: (organizers, { eq }) => eq(organizers.email, credentials.email),
          });

          if (!organizer) {
            throw new Error("Invalid credentials");
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(credentials.password as string, organizer.password ?? "");
          if (!passwordMatch) {
            throw new Error("Invalid credentials");
          }

          return {
            id: organizer.id.toString(),
            email: organizer.email,
            name: organizer.name,
            role: role,
            onboardingCompleted: organizer.onboardingCompleted,
          };
        }

        // For attendees, check credentials
        const attendee = await db.query.attendees.findFirst({
          where: (attendees, { eq }) => eq(attendees.email, credentials.email),
        });

        if (!attendee) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(credentials.password as string, attendee.password ?? "");
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: attendee.id.toString(),
          email: attendee.email,
          name: attendee.name,
          role: role,
          onboardingCompleted: attendee.onboardingCompleted,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign in callback:", { user, account });

      if (!user?.email) {
        console.log("No email provided");
        return false;
      }

      // Only allow Google sign-in for attendees
      if (account?.provider === "google") {
        // Check if user is trying to sign in as organizer
        const existingOrganizer = await db.query.organizers.findFirst({
          where: (organizers, { eq }) => eq(organizers.email, user.email),
        });

        if (existingOrganizer) {
          console.log("Organizer attempting to use Google sign-in");
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
