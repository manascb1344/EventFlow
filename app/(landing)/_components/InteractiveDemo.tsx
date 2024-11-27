"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LineChart, BarChart, Calendar, Users, Ticket, Sparkles } from "lucide-react";
import Image from "next/image";

const tabs = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: LineChart,
    content: {
      title: "Powerful Analytics Dashboard",
      description: "Get real-time insights into your event's performance with our comprehensive analytics dashboard.",
    }
  },
  {
    value: "ticketing",
    label: "Ticketing",
    icon: Ticket,
    content: {
      title: "Smart Ticketing System",
      description: "Manage ticket sales, types, and pricing with our intuitive ticketing interface.",
    }
  },
  {
    value: "scheduling",
    label: "Scheduling",
    icon: Calendar,
    content: {
      title: "Event Scheduling Made Easy",
      description: "Plan and organize your events with our drag-and-drop scheduling system.",
    }
  },
  {
    value: "attendees",
    label: "Attendees",
    icon: Users,
    content: {
      title: "Attendee Management",
      description: "Keep track of your attendees, manage registrations, and handle check-ins seamlessly.",
    }
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export function InteractiveDemo() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-2 mb-6 rounded-full border-primary/20 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-primary">Interactive Demo</span>
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            See It In Action
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Experience the power of EventFlow through our interactive feature showcase.
          </motion.p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 md:grid-cols-4 mb-12 bg-background/50 backdrop-blur-sm border border-primary/10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <Card className="p-8 bg-gradient-to-br from-background/80 via-background to-background/80 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-2xl font-semibold mb-4 text-white/90">{tab.content.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{tab.content.description}</p>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-primary/5 ring-1 ring-primary/10">
                    <div className="flex items-center justify-center w-full h-full">
                      <tab.icon className="h-16 w-16 text-primary/50" />
                    </div>
                  </div>
                </Card>
                
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src="/dashboard-preview.png"
                    alt="Dashboard Demo"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
