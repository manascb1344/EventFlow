'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";

type DashboardProps = {
  profile: { name?: string | null } | null;
  stats: {
    totalEvents: number;
    totalTickets: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    newEvents: number;
    recentRevenue: number;
    ticketSalesGrowth: number;
  };
}

export default function OrganizerDashboardContent({ profile, stats }: DashboardProps) {
  return (
    <div className="container mx-auto p-8 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            {profile?.name ? `Welcome, ${profile.name}` : 'Welcome'}
          </h1>
          <p className="text-zinc-400">Manage your events and track performance</p>
        </div>
        <Button
          className="relative h-10 px-6 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 border-0 shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
        >
          <Link href="/dashboard/organizer/events/create">
            Create New Event
          </Link>
        </Button>
      </div>

      {/* Stats and Upcoming Events Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-200">Total Events</CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <CalendarDays className="h-4 w-4 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                {stats.totalEvents}
              </div>
              <p className="text-xs text-zinc-400 mt-1">Events created</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-200">Total Attendees</CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                {stats.totalTickets}
              </div>
              <p className="text-xs text-zinc-400 mt-1">Across all events</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-200">Revenue</CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-400 mt-1">Total earnings</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-200">Active Events</CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <CalendarDays className="h-4 w-4 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                {stats.newEvents}
              </div>
              <p className="text-xs text-zinc-400 mt-1">Currently running</p>
            </CardContent>
          </Card>
        </div>

        <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium text-zinc-200">Upcoming Events</CardTitle>
              <CardDescription className="text-zinc-400">Your next scheduled events</CardDescription>
            </div>
            <Link href="/dashboard/organizer/events">
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-200">
                View all
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm">No upcoming events</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
