"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, LineChart, Ticket, Users } from "lucide-react";
import Image from "next/image";

const tabs = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: LineChart,
    title: "See sales as they happen",
    description:
      "Tickets sold, seats left, and revenue sit on one screen in the organizer dashboard.",
    image: "/images/dashboard.png",
    alt: "EventFlow organizer dashboard overview",
  },
  {
    value: "ticketing",
    label: "Ticketing",
    icon: Ticket,
    title: "One ticket per order",
    description:
      "A completed checkout creates a numbered ticket and holds a seat in the same transaction.",
    image: "/images/tickets.png",
    alt: "EventFlow attendee dashboard showing tickets",
  },
  {
    value: "scheduling",
    label: "Scheduling",
    icon: Calendar,
    title: "The date is the event",
    description:
      "Start and end times, venue, and registration deadline all live on the event page attendees see.",
    image: "/images/event-detail.png",
    alt: "EventFlow event detail page",
  },
  {
    value: "attendees",
    label: "Attendees",
    icon: Users,
    title: "A place for every ticket",
    description:
      "Attendees find their purchases and saved events in a dashboard of their own.",
    image: "/images/events.png",
    alt: "EventFlow events listing page",
  },
];

export function InteractiveDemo() {
  return (
    <section className="border-b border-white/10 py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <p className="editorial-kicker">Inside EventFlow</p>
          <h2 className="editorial-title">A look at the product.</h2>
        </div>

        <Tabs defaultValue="dashboard" className="mt-12">
          <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none border-b border-white/10 bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-4 text-sm text-[#8b93a3] data-[state=active]:border-p1 data-[state=active]:bg-transparent data-[state=active]:text-p1"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-10">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-[#f4f5f7]">
                    {tab.title}
                  </h3>
                  <p className="editorial-lead mt-4">{tab.description}</p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-white/5">
                  <Image
                    src={tab.image}
                    alt={tab.alt}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
