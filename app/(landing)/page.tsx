"use client"

import Hero from "./_components/sections/Hero"
import Features from "./_components/sections/Features"
import Pricing from "./_components/sections/Pricing"
import Faq from "./_components/sections/Faq"
import Testimonials from "./_components/sections/Testimonials"
import Download from "./_components/sections/Download"
import "./landing-page.css"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <Testimonials />
      <Download />
    </main>
  )
}
