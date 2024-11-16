import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db/drizzle";
import { users, UserRole } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Extend the built-in types
declare module "next-auth" {
  interface User {
    role: keyof typeof UserRole;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: keyof typeof UserRole;
    }
  }
  interface JWT {
    role?: keyof typeof UserRole;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Check if user exists in database
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, user.email)
      });

      if (!dbUser) {
        // Create new user if they don't exist
        await db.insert(users).values({
          email: user.email,
          name: user.name || '',
          role: "ATTENDEE", // Default role
          phoneNumber: '', // Required field
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!)
        });
        token.role = dbUser?.role || 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as keyof typeof UserRole;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
};
