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
import { CalendarDays, MapPin, Users, Clock, DollarSign, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { EventStatus } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { deleteEvent, publishEvent } from "../../../_actions/events";

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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{initialEvent.name}</h2>
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
              <CardTitle className="text-sm font-medium">Date & Time</CardTitle>
              <CardDescription>
                {format(new Date(initialEvent.startDate), 'MMM dd, yyyy h:mm a')}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <CardDescription>{initialEvent.location}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <CardDescription>
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
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Complete information about the event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {initialEvent.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Venue</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {initialEvent.venue}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Venue Capacity</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {initialEvent.venueCapacity} people
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Registration Deadline</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(initialEvent.registrationDeadline), 'PPP')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Ticket Price</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${initialEvent.ticketPrice}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardDescription>
                Manage event tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ticket management content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
              <CardDescription>
                View and manage event attendees
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Attendee management content */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
