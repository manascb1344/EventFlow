import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getOrganizerStats } from "./_actions/analytics";
import { getOrganizerProfile } from "./_actions/profile";
import { authOptions } from "@/lib/auth/authOptions";
import OrganizerDashboardContent from "./OrganizerDashboardContent";
import { db } from "@/lib/db/drizzle";
import { events } from "@/lib/db/schema";
import { and, eq, gte } from "drizzle-orm";

export default async function OrganizerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/organizer/signin");
  }

  if (session?.user?.role !== "ORGANIZER") {
    redirect("/");
  }

  const organizerId = parseInt(session.user.id);
  const statsResult = await getOrganizerStats(organizerId);
  const { profile } = await getOrganizerProfile(organizerId);
  const upcomingEvents = await db
    .select({
      id: events.id,
      name: events.name,
      location: events.location,
      startDate: events.startDate,
      seatsAvailable: events.seatsAvailable,
    })
    .from(events)
    .where(and(eq(events.organizerId, organizerId), gte(events.startDate, new Date())))
    .orderBy(events.startDate)
    .limit(5);

  if ("error" in statsResult) {
    return <div>Error loading organizer stats: {statsResult.error}</div>;
  }

  return <OrganizerDashboardContent stats={statsResult.stats} profile={profile ?? null} upcomingEvents={upcomingEvents} />;
}