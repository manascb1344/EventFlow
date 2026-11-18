"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-t border-zinc-800/50 bg-gray-950/80 backdrop-blur-xl"
    >
      <div className="container px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] via-[#8B94FA] to-[#6366F1]">EventFlow</h3>
            <p className="text-sm text-zinc-400">
              Making event planning smarter and more efficient.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-indigo-500/10" asChild>
                <Link href="https://twitter.com/eventflow" target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-indigo-500/10" asChild>
                <Link href="https://github.com/eventflow" target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-indigo-500/10" asChild>
                <Link href="https://linkedin.com/company/eventflow" target="_blank">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-zinc-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/auth/organizer/signup" className="text-zinc-400 hover:text-white transition-colors">
                  Become an Organizer
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-sm text-zinc-400">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-zinc-600"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-500 transition-colors">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800/50">
          <div className="text-center text-sm text-zinc-400">
            <p>&copy; {new Date().getFullYear()} EventFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
