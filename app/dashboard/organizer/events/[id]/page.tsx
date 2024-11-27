import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { getEvent } from "../../_actions/getEvent";
import EventDetailClient from "./_components/EventDetailClient";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/organizer/signin");
  }

  if (session?.user?.role !== "ORGANIZER") {
    redirect("/");
  }

  const eventId = parseInt(params.id);
  const result = await getEvent(eventId);

  if (result.error || !result.event) {
    return <div>Error: {result.error || "Event not found"}</div>;
  }

  return <EventDetailClient initialEvent={result.event} />;
}