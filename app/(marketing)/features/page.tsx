import { Check, Calendar, Users, ChartBar, Sparkles, Shield, Zap, Globe, Clock, MessageSquare, Paintbrush } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturesPage() {
  const mainFeatures = [
    {
      title: "Easy Event Planning",
      description: "Simplify your event planning process and make informed decisions.",
      icon: Sparkles,
      details: [
        "Venue recommendations based on event type and size",
        "Scheduling suggestions",
        "Budget optimization",
        "Attendee behavior prediction"
      ]
    },
    {
      title: "Smart Ticketing System",
      description: "Seamless ticket creation, distribution, and management with real-time analytics.",
      icon: Calendar,
      details: [
        "Dynamic pricing optimization",
        "Contactless check-in",
        "Fraud prevention",
        "Multiple ticket tiers"
      ]
    },
    {
      title: "Attendee Management",
      description: "Comprehensive tools to manage attendees, track registrations, and handle communications.",
      icon: Users,
      details: [
        "Automated email campaigns",
        "Custom registration forms",
        "Attendee segmentation",
        "Real-time attendance tracking"
      ]
    },
    {
      title: "Analytics Dashboard",
      description: "Detailed insights and analytics to help you understand your event's performance and attendee behavior.",
      icon: ChartBar,
      details: [
        "Real-time sales tracking",
        "Attendee demographics",
        "Marketing campaign performance",
        "Revenue analytics"
      ]
    }
  ]
  const additionalFeatures = [
    {
      title: "Global Reach",
      description: "Host events for audiences worldwide with multi-language support and localized payment options.",
      icon: Globe
    },
    {
      title: "Real-time Updates",
      description: "Keep attendees informed with instant notifications and live event updates.",
      icon: Clock
    },
    {
      title: "Enhanced Security",
      description: "Advanced security measures to protect your events and attendee data.",
      icon: Shield
    },
    {
      title: "Lightning Fast",
      description: "Optimized performance for smooth experience across all devices.",
      icon: Zap
    },
    {
      title: "Community Features",
      description: "Build engagement with integrated chat, networking, and social features.",
      icon: MessageSquare
    },
    {
      title: "Customizable Branding",
      description: "Tailor the event platform to match your brand identity and create a cohesive experience.",
      icon: Paintbrush
    }
  ]

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
          Powerful Features for Modern Events
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Everything you need to create, manage, and grow successful events in one platform
        </p>
      </div>

      {/* Main Features */}
      <div className="grid lg:grid-cols-2 gap-8 mb-24">
        {mainFeatures.map((feature, index) => (
          <div
            key={index}
            className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1 bg-indigo-500/10 p-3 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <feature.icon className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            </div>
            <ul className="space-y-3 pl-4">
              {feature.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-400">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Additional Features */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Additional Features</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Discover more powerful tools and capabilities that make EventFlow the perfect choice for your events
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {additionalFeatures.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group"
          >
            <div className="bg-indigo-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-indigo-500/20 transition-colors">
              <feature.icon className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-zinc-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center">
        <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-8">
          <span className="px-4 py-1 rounded-full bg-zinc-900">New: Event suggestions</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-zinc-400 mb-8">
          Join thousands of event organizers who trust EventFlow
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600">
            <Link href="/auth/organizer/signin">
              Start Free Trial
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  )
}
