import { Building2, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CareersPage() {
  const positions = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Join our core team to build and scale our event management platform."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create beautiful and intuitive experiences for event organizers and attendees."
    },
    {
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Develop AI-powered features to enhance event recommendations and insights."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "New York, NY",
      type: "Full-time",
      description: "Help our customers succeed in creating amazing events."
    }
  ]

  const benefits = [
    {
      icon: Building2,
      title: "Flexible Work",
      description: "Work from anywhere with flexible hours"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Collaborate with talented individuals"
    },
    {
      icon: Zap,
      title: "Fast Growth",
      description: "Rapid career advancement opportunities"
    }
  ]

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
          Join Our Team
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Help us revolutionize the future of event management
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50"
          >
            <div className="bg-indigo-500/10 p-3 rounded-lg w-fit mb-4">
              <benefit.icon className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
            <p className="text-zinc-400">{benefit.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div
            key={index}
            className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {position.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span>{position.department}</span>
                  <span>•</span>
                  <span>{position.location}</span>
                  <span>•</span>
                  <span>{position.type}</span>
                </div>
              </div>
              <Button className="bg-indigo-500 hover:bg-indigo-600">
                Apply Now
              </Button>
            </div>
            <p className="text-zinc-400">{position.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-zinc-400 mb-6">
          Don't see a position that matches your skills?
          <br />
          Send your resume to <a href="mailto:careers@eventflow.com" className="text-indigo-500 hover:underline">careers@eventflow.com</a>
        </p>
      </div>
    </div>
  )
}
