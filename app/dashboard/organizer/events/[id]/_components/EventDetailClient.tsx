'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Users, Edit, Trash2, Ticket, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { EventStatus, TicketStatus } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { deleteEvent, publishEvent, getEventTickets, getEventAttendees } from "../../../_actions/events";
import { useEffect, useState } from "react";

interface Attendee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
}

interface Ticket {
  id: number;
  ticketNumber: string;
  ticketStatus: string;
  ticketType: string;
  purchaseDate: string;
  attendee: Attendee;
}

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  ticketPrice: number;
  seatsAvailable: number;
  eventStatus: keyof typeof EventStatus;
  venue: string;
  venueCapacity: number;
  isPublic: boolean;
  registrationDeadline: string;
  ticketsSold?: number;
}

interface EventDetailClientProps {
  initialEvent: Event;
}

export default function EventDetailClient({ initialEvent }: EventDetailClientProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ticketsResult, attendeesResult] = await Promise.all([
          getEventTickets(initialEvent.id),
          getEventAttendees(initialEvent.id)
        ]);

        if (ticketsResult.tickets) {
          setTickets(ticketsResult.tickets);
        }
        if (attendeesResult.attendees) {
          setAttendees(attendeesResult.attendees);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load tickets and attendees');
      }
      setLoading(false);
    };

    fetchData();
  }, [initialEvent.id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const result = await deleteEvent(initialEvent.id);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success('Event deleted successfully');
        router.push('/dashboard/organizer/events');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const handlePublish = async () => {
    try {
      const result = await publishEvent(initialEvent.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Event published successfully');
      router.refresh();
    } catch (error) {
      console.error('Error publishing event:', error);
      toast.error('Failed to publish event');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{initialEvent.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={initialEvent.eventStatus === 'PUBLISHED' ? 'default' : 'secondary'}>
              {initialEvent.eventStatus}
            </Badge>
            {initialEvent.isPublic ? (
              <Badge variant="outline">Public</Badge>
            ) : (
              <Badge variant="outline">Private</Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          {initialEvent.eventStatus === 'DRAFT' && (
            <Button onClick={handlePublish}>
              Publish Event
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/dashboard/organizer/events/${initialEvent.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium text-white">Date & Time</CardTitle>
              <CardDescription className="text-white">
                {format(new Date(initialEvent.startDate), 'MMM dd, yyyy h:mm a')}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium text-white">Location</CardTitle>
              <CardDescription className="text-white">{initialEvent.location}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium text-white">Capacity</CardTitle>
              <CardDescription className="text-white">
                {initialEvent.ticketsSold || 0}/{initialEvent.seatsAvailable} seats filled
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Event Details</CardTitle>
              <CardDescription className="text-white">
                Complete information about the event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-white">Description</h4>
                <p className="text-sm text-white mt-1">
                  {initialEvent.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-white">Venue</h4>
                  <p className="text-sm text-white mt-1">
                    {initialEvent.venue}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white">Venue Capacity</h4>
                  <p className="text-sm text-white mt-1">
                    {initialEvent.venueCapacity} people
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white">Registration Deadline</h4>
                  <p className="text-sm text-white mt-1">
                    {format(new Date(initialEvent.registrationDeadline), 'PPP')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white">Ticket Price</h4>
                  <p className="text-sm text-white mt-1">
                    ₹{initialEvent.ticketPrice}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Tickets</CardTitle>
              <CardDescription className="text-white">
                Manage event tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-6">
                  <p className="text-white">Loading tickets...</p>
                </div>
              ) : tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <div key={ticket.id + index} className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50">
                      <div className="flex items-center space-x-4">
                        <Ticket className="h-8 w-8 text-indigo-500" />
                        <div>
                          <p className="font-medium text-white">{ticket.attendee.name}</p>
                          <p className="text-sm text-zinc-400">Ticket #{ticket.ticketNumber}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={ticket.ticketStatus === 'CONFIRMED' ? 'default' : 'secondary'}>
                              {ticket.ticketStatus}
                            </Badge>
                            <Badge variant="outline">{ticket.ticketType}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-400">
                          Purchased {format(new Date(ticket.purchaseDate), 'PP')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Ticket className="mx-auto h-12 w-12 text-zinc-400" />
                  <h3 className="mt-2 text-sm font-semibold text-white">No tickets sold</h3>
                  <p className="mt-1 text-sm text-white">
                    Tickets will appear here once they are purchased.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Attendees</CardTitle>
              <CardDescription className="text-white">
                View and manage event attendees
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-6">
                  <p className="text-white">Loading attendees...</p>
                </div>
              ) : attendees.length > 0 ? (
                <div className="space-y-4">
                  {attendees.map((attendee, index) => (
                    <div key={attendee.id + index} className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50">
                      <div className="flex items-center space-x-4">
                        {attendee.profileImage ? (
                          <img
                            src={attendee.profileImage}
                            alt={attendee.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <User className="h-10 w-10 text-indigo-500" />
                        )}
                        <div>
                          <p className="font-medium text-white">{attendee.name}</p>
                          <p className="text-sm text-zinc-400">{attendee.email}</p>
                          {attendee.phoneNumber && (
                            <p className="text-sm text-zinc-400">{attendee.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="mx-auto h-12 w-12 text-zinc-400" />
                  <h3 className="mt-2 text-sm font-semibold text-white">No attendees yet</h3>
                  <p className="mt-1 text-sm text-white">
                    Attendees will appear here once they register for the event.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
