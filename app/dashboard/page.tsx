"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && session.user.onboardingCompleted === false) {
      const role = session.user.role.toLowerCase();
      console.log("Redirecting to onboarding:", role);
      router.push(`/onboarding/${role}`);
    }
  }, [session, router]);

  if (!session?.user) {
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}
