import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin", 
  "/auth/register",
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
        
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin"
    },
  }
);
