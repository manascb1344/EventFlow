"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="border-b border-white/10">
      <div className="container grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <p className="editorial-kicker">Event management, handled</p>
          <h1 className="editorial-title">
            Your event, <br />
            from first ticket <br />
            <span className="text-p1">to last call.</span>
          </h1>
          <p className="editorial-lead mt-8">
            EventFlow gives organizers one place to publish an event, sell
            tickets, and see who is coming. Attendees browse, save, and buy in a
            few clicks.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Button
              size="lg"
              className="h-12 rounded-md bg-p1 px-6 font-semibold text-[#05121a] hover:bg-[#7bf6ff]"
              asChild
            >
              <Link href="/auth/organizer/signup">
                Create an event
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              href="/events"
              className="text-sm font-medium text-[#e7e9ee] underline decoration-white/25 underline-offset-4 hover:decoration-p1"
            >
              Browse events
            </Link>
          </div>
          <hr className="hairline mt-14" />
          <div className="grid grid-cols-3 gap-6 pt-6 text-sm">
            <div>
              <div className="font-semibold text-[#f4f5f7]">Publish</div>
              <div className="mt-1 text-[#8b93a3]">Dates, venue, price</div>
            </div>
            <div>
              <div className="font-semibold text-[#f4f5f7]">Sell</div>
              <div className="mt-1 text-[#8b93a3]">Stripe checkout</div>
            </div>
            <div>
              <div className="font-semibold text-[#f4f5f7]">Track</div>
              <div className="mt-1 text-[#8b93a3]">Sales and seats</div>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-white/5">
          <Image
            src="/images/dashboard.png"
            alt="EventFlow organizer dashboard showing event sales and attendance"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    </section>
  );
}
