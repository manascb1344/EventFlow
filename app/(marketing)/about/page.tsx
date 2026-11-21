import Image from "next/image";

const constraints = [
  {
    label: "Seat counts",
    text: "A seat is reserved when payment succeeds. Two people cannot buy the last ticket at the same time.",
  },
  {
    label: "Two roles",
    text: "Organizers manage events. Attendees buy and save tickets. Each sees only what they need.",
  },
  {
    label: "Clear pricing",
    text: "The ticket price is set by the organizer and shown on the event page before checkout.",
  },
];

export default function AboutPage() {
  return (
    <div className="container max-w-6xl py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <p className="editorial-kicker">About the project</p>
          <h1 className="editorial-title">EventFlow</h1>
          <p className="editorial-lead mt-8">
            A place to publish an event, sell tickets, and see who is coming.
            Built as a working product: real accounts, real checkout, and a
            database behind every ticket.
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-[#8b93a3]">
            The idea came from the same problem every organizer hits. A date, a
            venue, a price, and a list of names end up spread across a form, a
            spreadsheet, and a payment link. EventFlow puts those pieces in one
            flow.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-white/5">
          <Image
            src="/images/tickets.png"
            alt="EventFlow attendee dashboard showing saved tickets"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-[#f4f5f7]">
          What we took seriously
        </h2>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {constraints.map((item) => (
            <div key={item.label} className="border-t border-white/10 pt-6">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-p1">
                {item.label}
              </div>
              <p className="mt-4 leading-relaxed text-[#8b93a3]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 border-t border-white/10 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[#f4f5f7]">
          Built by
        </h2>
        <div className="mt-8 max-w-2xl">
          <div className="text-lg font-semibold text-[#f4f5f7]">
            Manas Bavaskar
          </div>
          <div className="mt-1 text-sm text-p1">Founder</div>
          <p className="mt-3 leading-relaxed text-[#8b93a3]">
            Built EventFlow as a full-stack product, from the Drizzle schema
            and auth flow through checkout, webhooks, and the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
