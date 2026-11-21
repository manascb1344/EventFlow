"use client";

const groups = [
  "Conferences and meetups",
  "Workshops and classes",
  "Concerts and festivals",
  "Community gatherings",
  "Fundraisers",
  "Product launches",
];

export function TargetUsers() {
  return (
    <section className="border-b border-white/10 py-20 lg:py-28">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="editorial-kicker">Any gathering</p>
            <h2 className="editorial-title">If it has a date, it fits.</h2>
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {groups.map((group, index) => (
              <li
                key={group}
                className="flex items-baseline gap-4 border-b border-white/10 pb-4"
              >
                <span className="font-mono text-xs text-p1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-lg text-[#e7e9ee]">{group}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
