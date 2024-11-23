"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-2 mb-6 rounded-full border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-blue-400">Revolutionizing Event Management</span>
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-zinc-200 to-zinc-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Streamline Your Events with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] via-[#8B94FA] to-[#6366F1]">
              EventFlow
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            The all-in-one platform that simplifies event planning, ticketing, and management. Create unforgettable experiences with powerful tools designed for modern event organizers.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              size="lg"
              className="relative h-14 px-8 text-base font-medium rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 border-0 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] hover:shadow-[0_0_0_4px_rgba(99,102,241,0.3)] dark:shadow-indigo-500/20 transition-all duration-300 group overflow-hidden"
              asChild
            >
              <Link href="/auth/attendee/signup">
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="relative h-14 px-8 text-base font-medium rounded-full border border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-zinc-300 backdrop-blur-sm transition-all duration-300 group"
            >
              <span className="relative z-10 flex items-center">
                View Demo
                <div className="ml-2 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
