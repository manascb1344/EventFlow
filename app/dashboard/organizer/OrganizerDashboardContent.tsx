'use client';

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
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
  const numbers = [
    { label: "Events", value: stats.totalEvents, hint: "Published by you" },
    { label: "Tickets sold", value: stats.totalTickets, hint: "Across all events" },
    { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, hint: "Test-mode total" },
    { label: "Running", value: stats.newEvents, hint: "Currently live" },
  ];

  return (
    <div className="container mx-auto space-y-10 p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-p1">Organizer overview</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f4f5f7]">
            {profile?.name ? `Welcome, ${profile.name}` : 'Welcome'}
          </h1>
          <p className="mt-2 text-sm text-[#8b93a3]">
            Manage your events and track ticket sales.
          </p>
        </div>
        <Button
          className="h-10 rounded-md bg-p1 px-5 font-semibold text-[#05121a] hover:bg-[#7bf6ff]"
          asChild
        >
          <Link href="/dashboard/organizer/events/create">Create New Event</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 lg:grid-cols-4">
        {numbers.map((item) => (
          <div key={item.label} className="bg-[#0a0c10] p-6">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-[#8b93a3]">
              {item.label}
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-[#f4f5f7]">
              {item.value}
            </div>
            <div className="mt-1 text-xs text-[#8b93a3]">{item.hint}</div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-lg font-semibold text-[#f4f5f7]">Upcoming events</h2>
            <p className="mt-1 text-sm text-[#8b93a3]">Your next scheduled events</p>
          </div>
          <Button variant="ghost" className="text-[#8b93a3] hover:text-[#f4f5f7]" asChild>
            <Link href="/dashboard/organizer/events">
              View all
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#8b93a3]">No upcoming events</p>
        </div>
      </div>
    </div>
  );
}
