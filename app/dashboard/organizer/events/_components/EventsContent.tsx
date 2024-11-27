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
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-zinc-500">Manage your events</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/organizer/events/create">Create New Event</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>
            View and manage all your created events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-6">
              <CalendarDays className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                No events
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Get started by creating a new event.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/dashboard/organizer/events/create">
                    Create New Event
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>
                        {format(new Date(event.startDate), "PPP")}
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.eventStatus}</TableCell>
                      <TableCell>
                        {event.ticketsSold || 0}/{event.seatsAvailable}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={`/dashboard/organizer/events/${event.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link
                              href={`/dashboard/organizer/events/${event.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
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
