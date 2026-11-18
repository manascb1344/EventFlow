"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, BarChart, CalendarIcon, ClipboardCheck, CreditCard, Sparkles, Ticket, Users } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

const features = [
  {
    title: "Event Creation",
    description: "Create and manage events with ease. Set ticket prices, manage seats, and handle speaker information all in one place.",
    icon: CalendarIcon,
  },
  {
    title: "Ticketing System",
    description: "Multiple ticket types, sales tracking, and QR code validation. Handle individual, group, and VIP tickets effortlessly.",
    icon: Ticket,
  },
  {
    title: "Speaker Management",
    description: "Comprehensive speaker profiles, session assignment, and schedule management for seamless coordination.",
    icon: Users,
  },
  {
    title: "Payment Processing",
    description: "Secure payment processing with Stripe integration. Track transactions and handle refunds automatically.",
    icon: CreditCard,
  },
  {
    title: "Survey System",
    description: "Collect post-event feedback, create custom questions, and send automated reminders to attendees.",
    icon: ClipboardCheck,
  },
  {
    title: "Advanced Analytics",
    description: "Real-time monitoring, detailed sales analysis, and comprehensive reporting for data-driven decisions.",
    icon: BarChart,
  },
];

export function FeaturesGrid() {
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
              <span className="text-blue-400">Comprehensive Features</span>
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-200 to-zinc-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Everything You Need
          </motion.h2>
          <motion.p 
            className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Powerful features designed to make event management seamless and efficient.
          </motion.p>
        </div>

        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="relative h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20">
                    <feature.icon className="size-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-zinc-200">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                  <div className="absolute right-6 bottom-6 opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    <ArrowUpRight className="size-6 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
