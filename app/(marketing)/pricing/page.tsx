import { Button } from "@/components/ui/button";
import Link from "next/link";

const included = [
  "Create and publish events with a date, venue, and ticket price",
  "Stripe Checkout for ticket purchases in test mode",
  "One numbered ticket and one reserved seat per completed order",
  "Organizer dashboard for sales and attendance",
  "Attendee dashboard for tickets and saved events",
  "Confirmation email when a ticket is issued",
];

export default function PricingPage() {
  return (
    <div className="container max-w-5xl py-20 lg:py-28">
      <p className="editorial-kicker">Pricing</p>
      <h1 className="editorial-title max-w-3xl">
        Free to try. No plan to pick.
      </h1>
      <p className="editorial-lead mt-8">
        EventFlow is running as a demo. There are no subscription tiers, no card
        on file, and no invoices. Create an organizer account and use the whole
        product.
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-xl font-semibold text-[#f4f5f7]">
            What you get
          </h2>
          <ul className="mt-6">
            {included.map((item) => (
              <li
                key={item}
                className="border-t border-white/10 py-4 leading-relaxed text-[#8b93a3] last:border-b"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-white/10 p-8">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-p1">
            Checkout
          </div>
          <p className="mt-4 leading-relaxed text-[#a6adbb]">
            Payments use Stripe test mode. Use test card 4242 4242 4242 4242,
            any future expiry, and any CVC. No real money moves. In the hosted
            demo, a demo checkout issues the same ticket without contacting
            Stripe.
          </p>
          <hr className="hairline my-8" />
          <Button
            className="h-12 rounded-md bg-p1 px-6 font-semibold text-[#05121a] hover:bg-[#7bf6ff]"
            asChild
          >
            <Link href="/auth/organizer/signup">
              Create an organizer account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
