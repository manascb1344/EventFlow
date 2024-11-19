"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Music, Briefcase, GraduationCap, Heart, Sparkles } from "lucide-react";

const targetGroups = [
  {
    icon: Calendar,
    title: "Corporate Events",
    description: "Perfect for conferences, seminars, and team-building events.",
  },
  {
    icon: Music,
    title: "Entertainment Events",
    description: "Ideal for concerts, festivals, and cultural shows.",
  },
  {
    icon: GraduationCap,
    title: "Educational Events",
    description: "Great for workshops, webinars, and training sessions.",
  },
  {
    icon: Heart,
    title: "Social Events",
    description: "Perfect for weddings, parties, and celebrations.",
  },
  {
    icon: Briefcase,
    title: "Business Events",
    description: "Suitable for trade shows, product launches, and networking events.",
  },
  {
    icon: Users,
    title: "Community Events",
    description: "Ideal for fundraisers, charity events, and local gatherings.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
};

export function TargetUsers() {
  return (
    <section className="relative py-32">
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-2 mb-6 rounded-full border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-blue-400">For Every Event Type</span>
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-200 to-zinc-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Built for Everyone
          </motion.h2>
          
          <motion.p 
            className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Whether you're organizing a corporate conference or a local community gathering, EventFlow has you covered.
          </motion.p>
        </div>

        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {targetGroups.map((group, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="relative h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20">
                    <group.icon className="size-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-zinc-200">{group.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{group.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
