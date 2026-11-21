import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Event pages",
    description:
      "Publish a name, date, venue, capacity, ticket price, description, and banner. Set a registration deadline and choose whether the event is public.",
  },
  {
    number: "02",
    title: "Tickets and checkout",
    description:
      "Stripe Checkout takes card payments in test mode. A completed payment creates a numbered ticket and records the payment against it.",
  },
  {
    number: "03",
    title: "Seat reservation",
    description:
      "Ticket creation, payment recording, and the seat decrement run in one transaction with a conditional update, so a sold-out event cannot oversell.",
  },
  {
    number: "04",
    title: "Organizer dashboard",
    description:
      "See event counts, ticket sales, and revenue. Create, edit, publish, and remove events from one place.",
  },
  {
    number: "05",
    title: "Attendee dashboard",
    description:
      "Attendees see their tickets, save events for later, and update their profile and notification settings.",
  },
  {
    number: "06",
    title: "Email receipts",
    description:
      "A confirmation email goes out when a ticket is issued, with the ticket number, amount, and event details.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container max-w-6xl py-20 lg:py-28">
      <p className="editorial-kicker">What is in the product</p>
      <h1 className="editorial-title max-w-3xl">
        The whole flow, from listing to ticket.
      </h1>
      <p className="editorial-lead mt-8">
        EventFlow covers the path an organizer and an attendee actually take.
        Every feature below is wired to the database, not a mock screen.
      </p>

      <div className="mt-16 grid gap-x-16 gap-y-2 lg:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.number}
            className="grid grid-cols-[3rem_1fr] gap-6 border-t border-white/10 py-8"
          >
            <span className="pt-1 font-mono text-xs text-p1">
              {feature.number}
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#f4f5f7]">
                {feature.title}
              </h2>
              <p className="mt-2 leading-relaxed text-[#8b93a3]">
                {feature.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 border-t border-white/10 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[#f4f5f7]">
          See it work
        </h2>
        <p className="editorial-lead mt-4">
          Create an organizer account to publish an event, then use a test card
          to buy a ticket and watch the seat count change.
        </p>
        <Button
          className="mt-8 h-12 rounded-md bg-p1 px-6 font-semibold text-[#05121a] hover:bg-[#7bf6ff]"
          asChild
        >
          <Link href="/auth/organizer/signup">Create an event</Link>
        </Button>
      </div>
    </div>
  );
}
