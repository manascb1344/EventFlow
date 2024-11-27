'use client';

import { useSession } from "next-auth/react";
import { redirect, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { CalendarDays, MapPin, Users, Clock, DollarSign, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { deleteEvent, publishEvent } from "../../_actions/events";
import { getEvent } from "../../_actions/getEvent";
import { EventStatus } from "@/lib/db/schema";

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

export default function EventDetailPage() {
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.id as string);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEvent(eventId);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        setEvent(result.event);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchEvent();
    }
  }, [session?.user?.id, eventId]);

  if (status === "unauthenticated") {
    redirect("/auth/organizer/signin");
  }

  if (session?.user?.role !== "ORGANIZER") {
    redirect("/");
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
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
      await publishEvent(eventId);
      setEvent(prev => prev ? { ...prev, eventStatus: 'published' } : null);
      toast.success('Event published successfully');
    } catch (error) {
      console.error('Error publishing event:', error);
      toast.error('Failed to publish event');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Event not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{event.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={event.eventStatus === 'published' ? 'default' : 'secondary'}>
              {event.eventStatus}
            </Badge>
            {event.isPublic ? (
              <Badge variant="outline">Public</Badge>
            ) : (
              <Badge variant="outline">Private</Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          {event.eventStatus === 'draft' && (
            <Button onClick={handlePublish}>
              Publish Event
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/dashboard/organizer/events/${event.id}/edit`}>
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
              <CardTitle className="text-sm font-medium">Date & Time</CardTitle>
              <CardDescription>
                {format(new Date(event.startDate), 'MMM dd, yyyy h:mm a')}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <CardDescription>{event.location}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <CardDescription>
                {event.ticketsSold || 0}/{event.seatsAvailable} seats filled
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

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Venue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue Name</span>
                  <span>{event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue Capacity</span>
                  <span>{event.venueCapacity}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price</span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {event.ticketPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Registration Deadline</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(event.registrationDeadline), 'MMM dd, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add ticket sales component here */}
              <div className="text-center py-8 text-muted-foreground">
                Ticket sales information will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <CardTitle>Attendee List</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add attendees list component here */}
              <div className="text-center py-8 text-muted-foreground">
                Attendee information will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
