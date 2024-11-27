import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        "Up to 2 events per month",
        "Basic analytics",
        "Email support",
        "Basic customization",
        "100 attendees per event"
      ]
    },
    {
      name: "Pro",
      price: "49",
      description: "Best for growing organizations",
      features: [
        "Unlimited events",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "1000 attendees per event",
        "custom-powered insights",
        "Custom domains"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale event management",
      features: [
        "Everything in Pro",
        "Unlimited attendees",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "Custom Service models"
      ]
    }
  ]

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Choose the perfect plan for your event management needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-8 rounded-xl border ${
              plan.name === "Pro"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">
                {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
              </span>
              {plan.price !== "Custom" && <span className="text-zinc-400">/month</span>}
            </div>
            <p className="text-zinc-400 mb-6">{plan.description}</p>
            <Button
              className={`w-full mb-8 ${
                plan.name === "Pro" ? "bg-indigo-500 hover:bg-indigo-600" : ""
              }`}
              asChild
            >
              <Link href={plan.price === "Custom" ? "/contact" : "/auth/organizer/signup"}>
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Link>
            </Button>
            <ul className="space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <span className="text-zinc-400">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-zinc-400">
          All plans include basic features like event creation, ticket management, and attendee communication.
          <br />
          Need a custom solution? <a href="/contact" className="text-indigo-500 hover:underline">Contact us</a>
        </p>
      </div>
    </div>
  )
}
