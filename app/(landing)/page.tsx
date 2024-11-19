"use client";

import { HeroSection } from "./_components/HeroSection";
import { FeaturesGrid } from "./_components/FeaturesGrid";
import { TargetUsers } from "./_components/TargetUsers";
import { InteractiveDemo } from "./_components/InteractiveDemo";
import { StatsSection } from "./_components/StatsSection";
import { Testimonials } from "./_components/Testimonials";
import { CTASection } from "./_components/CTASection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesGrid />
      <TargetUsers />
      <InteractiveDemo />
      <StatsSection />
      <Testimonials />
      <CTASection />
    </div>
  );
}