import { Users, Calendar, Award, Target, Heart, Sparkles, Globe, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const stats = [
    {
      icon: Users,
      value: "100,000+",
      label: "Event Organizers",
      description: "Trust EventFlow globally"
    },
    {
      icon: Calendar,
      value: "500,000+",
      label: "Events Hosted",
      description: "Successfully managed"
    },
    {
      icon: Award,
      value: "99.9%",
      label: "Uptime",
      description: "Reliable platform"
    },
    {
      icon: Target,
      value: "50M+",
      label: "Tickets Sold",
      description: "Through our platform"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize our users' success and satisfaction in everything we do."
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Constantly pushing boundaries with cutting-edge technology."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Making events accessible and manageable worldwide."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Maintaining the highest standards of data protection and privacy."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building meaningful connections through events and experiences."
    },
    {
      icon: Zap,
      title: "Excellence",
      description: "Delivering exceptional quality in every aspect of our service."
    }
  ]

  const team = [
    {
      name: "Manas Bavaskar",
      role: "CEO & Founder",
      image: "https://utfs.io/f/oEeAcIZsLgjpztmK9uO9RX704uqnL6UjYHsZw1ECM8ock2Wl",
      description: "Pre-final year student passionate about startups and SaaS, eager to innovate and contribute to the evolving tech landscape."
    }
  ]

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      {/* Hero Section */}
      <div className="text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
          About EventFlow
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
          Revolutionizing event management with cutting-edge solutions
        </p>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4">
              <p className="text-zinc-400">
                Founded in 2023, EventFlow emerged from a simple observation: event management
                was unnecessarily complex and disconnected. Our founders, seasoned event industry
                veterans, envisioned a platform that would revolutionize how events are created,
                managed, and experienced.
              </p>
              <p className="text-zinc-400">
                Today, we're proud to be the platform of choice for thousands of event organizers
                worldwide, powered by cutting-edge technology and a passionate team dedicated
                to transforming the events industry.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group">
                <div className="bg-indigo-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-zinc-400 mb-1">{stat.label}</div>
                <div className="text-xs text-zinc-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            The principles that guide us in building the future of event management
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group"
            >
              <div className="bg-indigo-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <value.icon className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-zinc-400">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Leadership</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Meet the visionary behind EventFlow
          </p>
        </div>
        <div className="max-w-md mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="group"
            >
              <div className="aspect-square mb-4 rounded-xl overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <div className="text-indigo-500 mb-2">{member.role}</div>
              <p className="text-zinc-400">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
