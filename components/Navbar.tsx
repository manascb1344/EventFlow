"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "border-b border-zinc-800/50 bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-950/80" 
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] via-[#8B94FA] to-[#6366F1]">EventFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/features" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-zinc-400 hover:text-white")}>
                      Features
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-zinc-400 hover:text-white">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[200px] bg-gray-950/95 backdrop-blur-xl border border-zinc-800/50">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/docs"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-500/10 hover:text-white focus:bg-indigo-500/10 focus:text-white"
                          >
                            <div className="text-sm font-medium leading-none">Documentation</div>
                            <p className="line-clamp-2 text-sm leading-snug text-zinc-400">
                              Learn how to use EventFlow
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/blog"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-500/10 hover:text-white focus:bg-indigo-500/10 focus:text-white"
                          >
                            <div className="text-sm font-medium leading-none">Blog</div>
                            <p className="line-clamp-2 text-sm leading-snug text-zinc-400">
                              Latest updates and guides
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-zinc-400 hover:text-white")}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex">
            <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-indigo-500/10">
              Sign In
            </Button>
          </div>
          <Button className="relative h-10 px-6 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 border-0 shadow-[0_0_0_1px_rgba(99,102,241,0.1)] hover:shadow-[0_0_0_2px_rgba(99,102,241,0.2)] transition-all duration-300">
            Get Started
          </Button>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-gray-950/95 backdrop-blur-xl border-zinc-800/50">
                <nav className="flex flex-col gap-4">
                  <Link href="/features" className="text-zinc-400 hover:text-white transition-colors">
                    Features
                  </Link>
                  <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                  <Link href="/blog" className="text-zinc-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                  <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar
