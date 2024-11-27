import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getOrganizerStats } from "./_actions/analytics";
import { getOrganizerProfile } from "./_actions/profile";
import { authOptions } from "@/lib/auth/authOptions";
import OrganizerDashboardContent from "./OrganizerDashboardContent";

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

  if ("error" in statsResult) {
    // Handle error case, maybe redirect or show an error message
    return <div>Error loading organizer stats: {statsResult.error}</div>;
  }

  return <OrganizerDashboardContent stats={statsResult.stats} profile={profile} />;
}