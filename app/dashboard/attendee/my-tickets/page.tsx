import { Metadata } from 'next';
import { getMyTickets } from './actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My Tickets | EventFlow',
  description: 'View all your event tickets',
};

export default async function MyTicketsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/attendee/signin');
  }
  if (session.user.role !== 'ATTENDEE') {
    redirect('/dashboard');
  }
  const tickets = await getMyTickets();

  const activeTickets = tickets.filter(
    ({ ticket }) => ticket.status === 'CONFIRMED' || ticket.status === 'PENDING'
  );
  const pastTickets = tickets.filter(
    ({ ticket }) => ticket.status === 'USED' || ticket.status === 'CANCELED'
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <DashboardHeader
          heading="My Tickets"
          text="View and manage your event tickets"
        />
        
        <div className="rounded-lg border bg-card">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent p-0">
              <TabsTrigger 
                value="active" 
                className="relative rounded-none border-b-2 border-transparent px-6 pb-3 pt-2 font-medium data-[state=active]:border-primary"
              >
                Active Tickets
                {activeTickets.length > 0 && (
                  <Badge className="ml-2 bg-primary/10 text-primary">{activeTickets.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="past"
                className="relative rounded-none border-b-2 border-transparent px-6 pb-3 pt-2 font-medium data-[state=active]:border-primary"
              >
                Past Tickets
                {pastTickets.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{pastTickets.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="active" className="mt-0">
                {activeTickets.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {activeTickets.map(({ ticket, event }) => (
                      <div key={ticket.id}>
                        <HoverCard openDelay={200}>
                          <HoverCardTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Card className="group cursor-pointer overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-md">
                                  <div className="relative aspect-video w-full overflow-hidden">
                                    <Image
                                      src={event.bannerImage || '/images/placeholder-event.png'}
                                      alt={event.name}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                                    <Badge className={cn(
                                      "absolute right-4 top-4",
                                      ticket.status === 'CONFIRMED' ? "bg-emerald-500/90 text-white" :
                                      "bg-yellow-500/90 text-white"
                                    )}>
                                      {ticket.status}
                                    </Badge>
                                  </div>

                                  <CardHeader className="space-y-0 pb-2 pt-4">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="line-clamp-1 text-lg font-semibold">
                                        {event.name}
                                      </CardTitle>
                                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                  </CardHeader>

                                  <CardContent className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="secondary" className="font-medium">
                                        {ticket.ticketType}
                                      </Badge>
                                      {ticket.seatNumber && (
                                        <Badge variant="outline">
                                          Seat {ticket.seatNumber}
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(new Date(event.startDate), 'EEE, MMM d')}</span>
                                        <span className="text-muted-foreground/60">•</span>
                                        <Clock className="h-4 w-4" />
                                        <span>{format(new Date(event.startDate), 'p')}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span className="line-clamp-1">{event.venue}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Ticket Details</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 space-y-6">
                                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                    <Image
                                      src={event.bannerImage || '/images/placeholder-event.png'}
                                      alt={event.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  <div>
                                    <h3 className="text-xl font-semibold">{event.name}</h3>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Badge variant="secondary" className="font-medium">
                                        {ticket.ticketType}
                                      </Badge>
                                      {ticket.seatNumber && (
                                        <Badge variant="outline">
                                          Seat {ticket.seatNumber}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-sm font-medium">Date & Time</div>
                                      <div className="mt-1.5 space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Calendar className="h-4 w-4" />
                                          <span>{format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Clock className="h-4 w-4" />
                                          <span>{format(new Date(event.startDate), 'p')}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-sm font-medium">Venue</div>
                                      <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.venue}</span>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-sm font-medium">Ticket Number</div>
                                      <div className="mt-1.5 font-mono text-sm text-muted-foreground">
                                        #{ticket.ticketNumber}
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* {ticket.qrCode && (
                                    <div className="rounded-lg border bg-muted/40 p-6">
                                      <div className="flex flex-col items-center space-y-4">
                                        <QRCodeSVG 
                                          value={ticket.qrCode} 
                                          size={200}
                                          className="rounded bg-white p-2"
                                        />
                                        <p className="text-center text-sm text-muted-foreground">
                                          Present this QR code at the event entrance for check-in
                                        </p>
                                      </div>
                                    </div>
                                  )} */}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </HoverCardTrigger>
                          
                          <HoverCardContent 
                            side="right" 
                            align="start"
                            className="w-80 p-0 border-2 bg-s1"
                          >
                            <div className="relative aspect-video w-full">
                              <Image
                                src={event.bannerImage || '/images/placeholder-event.png'}
                                alt={event.name}
                                fill
                                className="rounded-t-lg object-cover"
                              />
                              <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                              <Badge className={cn(
                                "absolute right-4 top-4",
                                ticket.status === 'CONFIRMED' ? "bg-emerald-500/90 text-white" :
                                "bg-yellow-500/90 text-white"
                              )}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <div className="space-y-2.5 p-4 bg-s1 text-p5">
                              <h4 className="font-semibold text-lg text-p4">{event.name}</h4>
                              <div className="flex flex-wrap gap-1.5">
                                <Badge variant="secondary" className="font-medium">
                                  {ticket.ticketType}
                                </Badge>
                                {ticket.seatNumber && (
                                  <Badge variant="outline">
                                    Seat {ticket.seatNumber}
                                  </Badge>
                                )}
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(event.startDate), 'EEE, MMM d')}</span>
                                  <span className="text-muted-foreground/60">•</span>
                                  <Clock className="h-4 w-4" />
                                  <span>{format(new Date(event.startDate), 'p')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span className="line-clamp-1">{event.venue}</span>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-semibold">No Active Tickets</h3>
                      <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        You don&apos;t have any upcoming event tickets. Browse our events to find your next experience!
                      </p>
                      <Button asChild>
                        <Link href="/events">Browse Events</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                {pastTickets.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {pastTickets.map(({ ticket, event }) => (
                      <Card key={ticket.id} className="group overflow-hidden border-2">
                        <div className="relative aspect-video w-full">
                          <Image
                            src={event.bannerImage || '/images/placeholder-event.png'}
                            alt={event.name}
                            fill
                            className="object-cover opacity-75 grayscale"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/30" />
                          <Badge className="absolute right-4 top-4" variant="secondary">
                            {ticket.status}
                          </Badge>
                        </div>

                        <CardHeader className="space-y-0 pb-2 pt-4">
                          <CardTitle className="line-clamp-1 text-lg">
                            {event.name}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="font-medium">
                              {ticket.ticketType}
                            </Badge>
                            {ticket.seatNumber && (
                              <Badge variant="outline">
                                Seat {ticket.seatNumber}
                              </Badge>
                            )}
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(event.startDate), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                            <div className="pt-1 text-xs text-muted-foreground">
                              Ticket #{ticket.ticketNumber}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-semibold">No Past Tickets</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Your attended events will appear here
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}
