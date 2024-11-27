import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getEvents } from "../_actions/getEvents";
import EventsContent from "./_components/EventsContent";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Unauthorized access attempt to EventsPage");
    redirect("/auth/organizer/signin");
  }

  if (session?.user?.role !== "ORGANIZER") {
    console.log(`User with role ${session?.user?.role} attempted to access EventsPage`);
    redirect("/");
  }

  const result = await getEvents();
  if (result.error) {
    console.error(`Error fetching events: ${result.error}`);
    return <div>Error: {result.error}</div>;
  }

  console.log(`EventsPage loaded successfully for organizer ${session.user.id}`);
  return <EventsContent initialEvents={result.events || []} />;
}