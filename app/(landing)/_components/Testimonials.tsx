"use client";

const notes = [
  {
    label: "Seats",
    text: "Reserved at checkout, not after it. A full event cannot be oversold.",
  },
  {
    label: "Receipts",
    text: "A confirmation email goes out when a ticket is issued.",
  },
  {
    label: "Access",
    text: "Organizer and attendee accounts are separate, with the right view for each.",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-white/10 py-20 lg:py-28">
      <div className="container">
        <p className="editorial-kicker">The details</p>
        <h2 className="editorial-title max-w-2xl">
          Built around what actually happens on the night.
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 md:grid-cols-3">
          {notes.map((note) => (
            <div key={note.label} className="bg-[#0a0c10] p-8">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-p1">
                {note.label}
              </div>
              <p className="mt-4 leading-relaxed text-[#a6adbb]">{note.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
