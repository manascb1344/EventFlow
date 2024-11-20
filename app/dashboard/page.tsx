"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.onboardingCompleted === false) {
      const role = session.user.role.toLowerCase();
      console.log("Redirecting to onboarding:", role);
      router.push(`/onboarding/${role}`);
      return;
    }

    // Role-based routing
    const role = session.user.role.toLowerCase();
    if (role === 'attendee') {
      router.push('/dashboard/attendee');
    } else if (role === 'organizer') {
      router.push('/dashboard/organizer');
    }
  }, [session, router]);

  // Show loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}
