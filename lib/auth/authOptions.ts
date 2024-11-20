import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db/drizzle";
import { organizers, attendees, UserRole } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
    }
  }
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

        // Find user based on role
        let user;
        if (role === "ORGANIZER") {
          user = await db.query.organizers.findFirst({
            where: (organizers, { eq }) => eq(organizers.email, credentials.email),
          });
        } else {
          user = await db.query.attendees.findFirst({
            where: (attendees, { eq }) => eq(attendees.email, credentials.email),
          });
        }

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: role,
          onboardingCompleted: user.onboardingCompleted,
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

      if (account?.provider === "google") {
        console.log("Google sign in");
        
        // Check if user exists in either table
        const existingOrganizer = await db.query.organizers.findFirst({
          where: (organizers, { eq }) => eq(organizers.email, user.email),
        });

        const existingAttendee = await db.query.attendees.findFirst({
          where: (attendees, { eq }) => eq(attendees.email, user.email),
        });

        if (!existingOrganizer && !existingAttendee) {
          console.log("Creating new attendee");
          // Create new attendee if they don't exist
          const [newAttendee] = await db.insert(attendees).values({
            email: user.email,
            name: user.name || "",
            onboardingCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }).returning();

          console.log("New attendee created:", newAttendee);
          user.id = newAttendee.id.toString();
          user.role = "ATTENDEE";
          user.onboardingCompleted = false;
        } else if (existingOrganizer) {
          console.log("Existing organizer found:", existingOrganizer);
          user.id = existingOrganizer.id.toString();
          user.role = "ORGANIZER";
          user.onboardingCompleted = existingOrganizer.onboardingCompleted;
        } else if (existingAttendee) {
          console.log("Existing attendee found:", existingAttendee);
          user.id = existingAttendee.id.toString();
          user.role = "ATTENDEE";
          user.onboardingCompleted = existingAttendee.onboardingCompleted;
        }
      }

      // console.log("Final user object:", user);
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      console.log("JWT callback:", { token, user, trigger });
      
      if (user) {
        console.log("Setting JWT from user:", user);
        token.id = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }

      // Update token if session is updated
      if (trigger === "update" && session) {
        console.log("Updating JWT from session:", session);
        token.onboardingCompleted = session.user.onboardingCompleted;
      }

      // console.log("Final JWT token:", token);
      return token;
    },

    async session({ session, token }) {
      // console.log("Session callback:", { session, token });
      
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }

      // console.log("Final session:", session);
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/register',
  },
  session: {
    strategy: "jwt",
  }
};
