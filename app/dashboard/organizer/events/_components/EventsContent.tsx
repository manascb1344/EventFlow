'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteEvent } from "../../_actions/events";
import { toast } from "sonner";
import { format } from "date-fns";
import { EventStatus } from "@/lib/db/schema";

interface Event {
  id: number;
  name: string;
  startDate: Date;
  location: string;
  eventStatus: keyof typeof EventStatus;
  seatsAvailable: number;
  ticketsSold?: number;
}

interface EventsContentProps {
  initialEvents: Event[];
}

export default function EventsContent({ initialEvents }: EventsContentProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const result = await deleteEvent(eventId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Events</h1>
          <p className="text-sm text-white/70">Manage your events and track their performance</p>
        </div>
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <Link href="/dashboard/organizer/events/create">
            <span className="flex items-center gap-2">Create New Event</span>
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-zinc-200 bg-zinc-900/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-white">Your Events</CardTitle>
          <CardDescription className="text-sm text-white/70">
            View and manage all your created events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="mx-auto h-12 w-12 text-white/30" />
              <h3 className="mt-4 text-base font-medium text-white">
                No events yet
              </h3>
              <p className="mt-2 text-sm text-white/70 max-w-sm mx-auto">
                Get started by creating your first event. It only takes a few minutes.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/dashboard/organizer/events/create">
                    Create New Event
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-700">
                    <TableHead className="font-medium text-white/90">Name</TableHead>
                    <TableHead className="font-medium text-white/90">Date</TableHead>
                    <TableHead className="font-medium text-white/90">Location</TableHead>
                    <TableHead className="font-medium text-white/90">Status</TableHead>
                    <TableHead className="font-medium text-white/90">Tickets</TableHead>
                    <TableHead className="font-medium text-white/90">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="hover:bg-zinc-800/50 border-zinc-700">
                      <TableCell className="font-medium text-white">{event.name}</TableCell>
                      <TableCell className="text-white/80">
                        {format(new Date(event.startDate), "PPP")}
                      </TableCell>
                      <TableCell className="text-white/80">{event.location}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${event.eventStatus === 'DRAFT' ? 'bg-yellow-500/20 text-yellow-200' : 
                          event.eventStatus === 'PUBLISHED' ? 'bg-green-500/20 text-green-200' :
                          event.eventStatus === 'CANCELED' ? 'bg-red-500/20 text-red-200' :
                          'bg-zinc-500/20 text-white/80'}`}>
                          {event.eventStatus.toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-white/80">
                        <span className="font-medium text-white">{event.ticketsSold || 0}</span>
                        <span className="text-white/40">/</span>
                        <span>{event.seatsAvailable}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-zinc-700 text-white/60 hover:text-white"
                            asChild
                          >
                            <Link href={`/dashboard/organizer/events/${event.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-zinc-700 text-white/60 hover:text-white"
                            asChild
                          >
                            <Link href={`/dashboard/organizer/events/${event.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-zinc-700 text-white/60 hover:text-red-300"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
