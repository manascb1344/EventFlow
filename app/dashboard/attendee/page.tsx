import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { getAttendeeStats, getUpcomingEvents } from "@/lib/actions/attendee";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Attendee Dashboard | EventFlow",
  description: "Manage your event registrations and upcoming events",
};

export default async function AttendeeDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/attendee/signin");
  }

  const attendeeId = parseInt(session.user.id);
  const stats = await getAttendeeStats(attendeeId);
  const upcomingEvents = await getUpcomingEvents(attendeeId);

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome back, ${session.user.name}!`}
        text="Manage your event registrations and upcoming events."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEventsCount}</div>
            <p className="text-xs text-muted-foreground">
              Events in the next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Events
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registeredEventsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total events registered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nearby Events
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nearbyEventsCount}</div>
            <p className="text-xs text-muted-foreground">
              Events in your area
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="divide-y divide-border rounded-md border">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id + index} className="p-4">
                    <h3 className="font-semibold">{event.name}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <p>{event.location}</p>
                      <p>
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming events. Browse events to register!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
