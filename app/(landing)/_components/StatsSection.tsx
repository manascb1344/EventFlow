"use client";

const points = [
  {
    term: "For organizers",
    detail:
      "Create an event, set a price, and watch sales come in. The dashboard shows tickets sold and seats remaining in real time.",
  },
  {
    term: "For attendees",
    detail:
      "Find something to do, save it, and buy a ticket. Tickets stay in one dashboard with the event details.",
  },
  {
    term: "For the ticket",
    detail:
      "Every completed checkout issues one ticket and reserves one seat in a single database transaction, so two people cannot claim the same spot.",
  },
];

export function StatsSection() {
  return (
    <section className="border-b border-white/10 py-20 lg:py-28">
      <div className="container">
        <p className="editorial-kicker">Two sides, one platform</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {points.map((point) => (
            <div key={point.term} className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-[#f4f5f7]">
                {point.term}
              </h3>
              <p className="mt-3 leading-relaxed text-[#8b93a3]">
                {point.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
