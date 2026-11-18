"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Director",
    company: "TechConf Global",
    content: "EventFlow has revolutionized how we manage our tech conferences. The platform's intuitive interface and powerful features have made event planning a breeze.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    company: "Creative Summit",
    content: "The analytics and reporting features are outstanding. We've been able to make data-driven decisions that have significantly improved our event outcomes.",
    rating: 5
  },
  {
    name: "Emma Williams",
    role: "Community Manager",
    company: "StartupHub",
    content: "From ticketing to attendee management, EventFlow has streamlined our entire event planning process. It's been a game-changer for our organization.",
    rating: 5
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 }
};

export function Testimonials() {
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
              <span className="text-primary">Testimonials</span>
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            What Our Users Say
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover why event organizers choose EventFlow for their event management needs.
          </motion.p>
        </div>

        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="relative h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
                <CardContent className="p-8">
                  <Quote className="size-8 text-primary/40 mb-6" />
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="size-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <blockquote className="mb-6 text-lg leading-relaxed text-white/80">
                    &quot;{testimonial.content}&quot;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-white/90">{testimonial.name}</div>
                    <div className="text-primary">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
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
