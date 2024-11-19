"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Star, Users, Sparkles } from "lucide-react";

const stats = [
  {
    label: "Events Hosted",
    value: "10,000+",
    icon: CalendarIcon,
    description: "Successful events managed through our platform"
  },
  {
    label: "Active Users",
    value: "50,000+",
    icon: Users,
    description: "Event organizers trust EventFlow"
  },
  {
    label: "Hours Saved",
    value: "100,000+",
    icon: Clock,
    description: "Time saved in event management"
  },
  {
    label: "Average Rating",
    value: "4.9/5",
    icon: Star,
    description: "From satisfied event organizers"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 }
};

export function StatsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute h-full w-full" />
      
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-2 mb-6 rounded-full border-primary/20 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-primary">By The Numbers</span>
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Trusted by Event Organizers
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of event organizers who have chosen EventFlow to power their events.
          </motion.p>
        </div>

        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="relative h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
                <div className="p-8">
                  <div className="mb-6 size-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-lg shadow-primary/10">
                    <stat.icon className="size-7 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white/90">{stat.value}</h3>
                    <p className="text-lg font-medium text-primary">{stat.label}</p>
                    <p className="text-muted-foreground leading-relaxed">{stat.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
