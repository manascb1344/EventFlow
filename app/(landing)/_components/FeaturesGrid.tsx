"use client";

const features = [
  {
    number: "01",
    title: "Build the event",
    description:
      "Set the date, venue, capacity, and ticket price. Add a banner and a description, then publish when you are ready.",
  },
  {
    number: "02",
    title: "Sell the ticket",
    description:
      "Stripe Checkout takes payment. Each order creates one ticket with its own number and reserves one seat.",
  },
  {
    number: "03",
    title: "Know the room",
    description:
      "See tickets sold, seats left, and revenue in the organizer dashboard as orders arrive.",
  },
  {
    number: "04",
    title: "Keep attendees close",
    description:
      "Attendees save events, buy tickets, and find everything again in their own dashboard.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="border-b border-white/10 py-20 lg:py-28">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="editorial-kicker">How it works</p>
            <h2 className="editorial-title">Four steps, one system.</h2>
            <p className="editorial-lead mt-6">
              No spreadsheets, no separate checkout, no manual seat counts. The
              whole flow lives in one place.
            </p>
          </div>
          <div>
            {features.map((feature) => (
              <article
                key={feature.number}
                className="grid grid-cols-[3rem_1fr] gap-6 border-t border-white/10 py-7 last:border-b"
              >
                <span className="pt-1 font-mono text-xs text-p1">
                  {feature.number}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-[#f4f5f7]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-[#8b93a3]">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
