import { ArrowRight, Bug, Sparkles, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChangelogPage() {
  const releases = [
    {
      version: "2.1.0",
      date: "2024-01-15",
      type: "feature",
      icon: Sparkles,
      title: "Smart Event Recommendations",
      description: "Introducing personalized event recommendations based on attendee preferences and behavior.",
      changes: [
        "New recommendation engine",
        "Personalized event suggestions",
        "Improved search relevancy",
        "Enhanced attendee profiles"
      ]
    },
    {
      version: "2.0.1",
      date: "2024-01-10",
      type: "fix",
      icon: Bug,
      title: "Bug Fixes and Performance Improvements",
      description: "Various bug fixes and performance optimizations.",
      changes: [
        "Fixed ticket scanning issues",
        "Improved page load times",
        "Fixed email notification delays",
        "Resolved mobile layout issues"
      ]
    },
    {
      version: "2.0.0",
      date: "2024-01-01",
      type: "major",
      icon: Wrench,
      title: "Major Platform Update",
      description: "Complete platform overhaul with new features and improvements.",
      changes: [
        "New dashboard interface",
        "Advanced analytics tools",
        "Improved ticket management",
        "Enhanced security features"
      ]
    }
  ]

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-green-500/10 text-green-500"
      case "fix":
        return "bg-orange-500/10 text-orange-500"
      case "major":
        return "bg-p1/10 text-p1"
      default:
        return "bg-zinc-500/10 text-zinc-500"
    }
  }

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="editorial-title mb-8">
          Changelog
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Latest updates and improvements to the EventFlow platform
        </p>
      </div>

      <div className="space-y-12">
        {releases.map((release, index) => (
          <div
            key={index}
            className="relative pl-8 before:absolute before:left-[11px] before:top-[30px] before:h-[calc(100%-20px)] before:w-px before:bg-zinc-800"
          >
            <div className="absolute left-0 top-[14px] h-6 w-6 rounded-full border-2 border-zinc-800 bg-zinc-900" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`px-2 py-1 rounded text-sm ${getTypeStyles(release.type)}`}>
                  v{release.version}
                </div>
                <span className="text-sm text-zinc-400">{release.date}</span>
              </div>

              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getTypeStyles(release.type)}`}>
                  <release.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">{release.title}</h2>
                  <p className="text-zinc-400 mb-4">{release.description}</p>
                  <ul className="space-y-2">
                    {release.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-center gap-2 text-zinc-400">
                        <ArrowRight className="h-4 w-4 text-p1" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button className="bg-p1 hover:bg-[#7bf6ff]">
          View Full Release History
        </Button>
      </div>
    </div>
  )
}
