import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin", 
  "/auth/signup",
  "/auth/register",
  "/auth/register/organizer",
];

// Routes that require onboarding completion for organizers
const organizerProtectedRoutes = [
  "/dashboard/organizer",
  "/dashboard/organizer/events",
  "/dashboard/organizer/attendees",
  "/dashboard/organizer/settings"
];

// Export middleware configuration first
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth routes (NextAuth.js endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
};

export default withAuth(
  function middleware(req) {
    const isPublicRoute = publicRoutes.some(route => 
      req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith("/api/auth/")
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Check if the route requires onboarding completion for organizers
    const requiresOnboarding = organizerProtectedRoutes.some(route =>
      req.nextUrl.pathname.startsWith(route)
    );

    if (requiresOnboarding) {
      const token = req.nextauth.token;
      
      // If user is an organizer and hasn't completed onboarding, redirect to onboarding
      if (token?.role === "ORGANIZER" && !token?.onboardingCompleted) {
        const onboardingUrl = new URL("/onboarding/organizer", req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isPublicRoute = publicRoutes.some(route => 
          req.nextUrl.pathname === route
        );
        
        if (isPublicRoute) {
          return true;
        }

        // Allow access to onboarding routes even if onboarding is not completed
        if (req.nextUrl.pathname.startsWith("/onboarding/")) {
          return !!token;
        }
        
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin"
    },
  }
);
