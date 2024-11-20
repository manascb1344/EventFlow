import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapIcon, TicketIcon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: {
    id: number;
    name: string;
    location: string;
    startDate: Date;
    endDate: Date;
    ticketPrice: number;
    description: string;
    bannerImage: string | null;
    venue: string | null;
    seatsAvailable: number;
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        {event.bannerImage ? (
          <Image
            src={event.bannerImage}
            alt={event.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold leading-none tracking-tight">
            {event.name}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapIcon className="h-4 w-4" />
            <span>{event.venue || event.location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5">
        <div className="flex items-center space-x-1 text-sm">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(event.startDate, "PPP")}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <TicketIcon className="h-4 w-4" />
          <span>
            {event.seatsAvailable} seats available · ${event.ticketPrice}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
