import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, TicketIcon, BookmarkIcon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useTransition, useState } from "react";
import { cn } from "@/lib/utils";

export interface Event {
  id: number;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  ticketPrice: string | number;
  seatsAvailable: number;
  bannerImage?: string | null;
  venue?: string | null;
  isSaved?: boolean;
  savedEventId?: number;
}

interface EventCardProps {
  event: Event;
  onSaveToggle?: (eventId: number) => Promise<void>;
  onUnsaveToggle?: (eventId: number) => Promise<void>;
  showSaveButton?: boolean;
}

export function EventCard({ 
  event: initialEvent, 
  onSaveToggle, 
  onUnsaveToggle,
  showSaveButton = true 
}: EventCardProps) {
  const [isPending, startTransition] = useTransition();
  const [event, setEvent] = useState(initialEvent);

  const handleSaveToggle = () => {
    if (!onSaveToggle || !onUnsaveToggle) return;

    startTransition(async () => {
      try {
        if (event.isSaved) {
          await onUnsaveToggle(event.savedEventId || event.id);
        } else {
          await onSaveToggle(event.id);
        }
        setEvent(prev => ({
          ...prev,
          isSaved: !prev.isSaved
        }));
      } catch (error) {
        console.error('Failed to toggle save status:', error);
      }
    });
  };

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
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              {event.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.venue || event.location}</span>
            </div>
          </div>
          {showSaveButton && onSaveToggle && onUnsaveToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                event.isSaved && "text-primary",
                isPending && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleSaveToggle}
              disabled={isPending}
            >
              <BookmarkIcon className={cn("h-4 w-4", event.isSaved && "fill-current")} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5">
        <div className="flex items-center space-x-1 text-sm">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {format(new Date(event.startDate), "MMM d, yyyy")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm">
          <TicketIcon className="h-4 w-4" />
          <span>
            {event.ticketPrice === "0.00" || event.ticketPrice === "0"
              ? "Free"
              : `$${Number(event.ticketPrice).toFixed(2)}`}
          </span>
        </div>
        <Button asChild>
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
