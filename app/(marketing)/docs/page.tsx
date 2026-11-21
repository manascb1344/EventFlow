import { Book, Code2, FileText, Lightbulb, Settings, Webhook } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocsPage() {
  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of EventFlow",
      links: ["Quick Start Guide", "Installation", "Basic Concepts"]
    },
    {
      icon: Code2,
      title: "API Reference",
      description: "Complete API documentation",
      links: ["Authentication", "Endpoints", "Rate Limits"]
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "Configure your EventFlow instance",
      links: ["Environment Setup", "Custom Domains", "Security Settings"]
    },
    {
      icon: Webhook,
      title: "Integrations",
      description: "Connect with other services",
      links: ["Payment Gateways", "Email Providers", "Analytics Tools"]
    },
    {
      icon: Lightbulb,
      title: "Best Practices",
      description: "Tips for optimal usage",
      links: ["Performance", "Security", "Scalability"]
    },
    {
      icon: FileText,
      title: "Tutorials",
      description: "Step-by-step guides",
      links: ["Creating Events", "Managing Tickets", "Analytics"]
    }
  ]

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="editorial-title mb-8">
          Documentation
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Everything you need to build with EventFlow
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
          >
            <div className="bg-p1/10 p-3 rounded-lg w-fit mb-4">
              <category.icon className="h-6 w-6 text-p1" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{category.title}</h2>
            <p className="text-zinc-400 mb-4">{category.description}</p>
            <ul className="space-y-2">
              {category.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-white"
                  >
                    {link}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-start gap-6">
          <div className="bg-p1/10 p-3 rounded-lg">
            <Lightbulb className="h-6 w-6 text-p1" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Need Help?</h2>
            <p className="text-zinc-400 mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex gap-4">
              <Button className="bg-p1 hover:bg-[#7bf6ff]">
                Contact Support
              </Button>
              <Button variant="outline">
                Join Discord Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
