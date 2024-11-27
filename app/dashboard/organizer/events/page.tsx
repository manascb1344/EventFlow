'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
import { useEffect, useState } from "react";
import { deleteEvent } from "../_actions/events";
import { getEvents } from "../_actions/getEvents";
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

export default function EventsPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await getEvents();
        if (result.error) {
          toast.error(result.error);
          return;
        }
        setEvents(result.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchEvents();
    }
  }, [session?.user?.id]);

  if (status === "unauthenticated") {
    redirect("/auth/organizer/signin");
  }

  if (session?.user?.role !== "ORGANIZER") {
    redirect("/");
  }

  const handleDelete = async (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(events.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const getStatusColor = (status: keyof typeof EventStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
      canceled: 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Events</h2>
          <p className="text-muted-foreground">
            Create and manage your events here.
          </p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/dashboard/organizer/events/create">Create Event</Link>
        </Button>
      </div>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-foreground">All Events</CardTitle>
          <CardDescription className="text-muted-foreground">
            A list of all your events including upcoming and past events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-accent/20">
                <TableHead className="text-muted-foreground">Event Name</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Tickets Sold</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No events found. Create your first event!
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id} className="border-accent/20">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-accent" />
                        <span>{event.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(event.startDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{event.location}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(event.eventStatus)}`}>
                        {event.eventStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {event.ticketsSold || 0}/{event.seatsAvailable}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-accent/10 hover:text-accent"
                          asChild
                        >
                          <Link href={`/dashboard/organizer/events/${event.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-accent/10 hover:text-accent"
                          asChild
                        >
                          <Link href={`/dashboard/organizer/events/${event.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-accent/10 hover:text-accent"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
