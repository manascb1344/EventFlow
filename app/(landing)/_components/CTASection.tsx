"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="editorial-kicker">Get started</p>
            <h2 className="editorial-title">
              Put your event <br />
              on the calendar.
            </h2>
          </div>
          <div>
            <p className="editorial-lead">
              Create an organizer account, publish your first event, and share
              the link. Test checkout works with Stripe test cards, so you can
              try the full flow before going live.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
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
                href="/docs"
                className="text-sm font-medium text-[#e7e9ee] underline decoration-white/25 underline-offset-4 hover:decoration-p1"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
