import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getOrganizerStats } from "./_actions/analytics";
import { getOrganizerProfile } from "./_actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { authOptions } from "@/lib/auth/authOptions";

export default async function OrganizerDashboard() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not an organizer
  if (!session) {
    redirect("/auth/organizer/signin");
  }

  if (session?.user?.role !== "ORGANIZER") {
    redirect("/");
  }

  const organizerId = parseInt(session.user.id);
  const { stats } = await getOrganizerStats(organizerId);
  const { profile } = await getOrganizerProfile(organizerId);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile?.name}</h1>
          <p className="text-zinc-500">Manage your events and organization</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/organizer/events/create">
            Create New Event
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.events.totalEvents || 0}</div>
            <p className="text-xs text-zinc-500">Events created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.attendees.totalAttendees || 0}</div>
            <p className="text-xs text-zinc-500">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.revenue.totalRevenue || 0}</div>
            <p className="text-xs text-zinc-500">Total earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.events.upcomingEvents || 0}</div>
            <p className="text-xs text-zinc-500">Currently running</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-zinc-500">
              No upcoming events
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-zinc-500">
              No recent activity
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button variant="outline" className="h-24" asChild>
          <Link href="/dashboard/organizer/events">
            <CalendarDays className="h-6 w-6 mb-2" />
            Manage Events
          </Link>
        </Button>
        <Button variant="outline" className="h-24" asChild>
          <Link href="/dashboard/organizer/attendees">
            <Users className="h-6 w-6 mb-2" />
            View Attendees
          </Link>
        </Button>
        <Button variant="outline" className="h-24" asChild>
          <Link href="/dashboard/organizer/settings">
            <Settings className="h-6 w-6 mb-2" />
            Organization Settings
          </Link>
        </Button>
      </div>
    </div>
  );
}
