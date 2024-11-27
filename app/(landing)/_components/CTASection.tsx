"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute h-full w-full" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-2 mb-6 rounded-full border-primary/20 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-primary">Get Started Today</span>
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ready to Transform Your Events?
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of successful event organizers who have already revolutionized their event management with EventFlow.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button size="lg" className="h-14 px-8 text-base rounded-full bg-primary hover:bg-primary/90 group" asChild>
              <Link href="/auth/organizer/signin">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-primary/20 hover:bg-primary/10">
              Schedule Demo
            </Button>
          </motion.div>
        </div>

        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[128px] opacity-50" />
        </div>
      </div>
    </section>
  );
}
