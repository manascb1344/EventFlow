"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { UserNav } from "./UserNav"
import { MainNav } from "./MainNav"
import { Search } from "./Search"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getNavItems = () => {
    // During loading state or if session is not available, return default navigation
    if (!mounted || status === "loading" || !session) {
      return [
        { href: "/features", label: "Features" },
        { href: "/events", label: "Events" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ];
    }

    // After session is loaded, return role-specific navigation
    if (session?.user?.role === "ORGANIZER") {
      return [
        { href: "/dashboard/organizer", label: "Dashboard" },
        { href: "/dashboard/organizer/events/create", label: "Create Event" },
        { href: "/dashboard/organizer/events", label: "My Events" },
        { href: "/dashboard/organizer/analytics", label: "Analytics" },
        { href: "/dashboard/organizer/settings", label: "Settings" },
      ];
    }

    if (session?.user?.role === "ATTENDEE") {
      return [
        { href: "/events", label: "Browse Events" },
        { href: "/my-tickets", label: "My Tickets" },
        { href: "/saved-events", label: "Saved Events" },
        { href: "/profile", label: "Profile" },
      ];
    }

    // Default navigation for unauthenticated users
    return [
      { href: "/features", label: "Features" },
      { href: "/events", label: "Events" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ];
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-white/10 bg-white/[0.02] backdrop-blur-[12px] backdrop-saturate-[1.8] supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between bg-gradient-to-r from-gray-950/50 via-transparent to-gray-950/50">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] via-[#8B94FA] to-[#6366F1]">EventFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <MainNav items={getNavItems()} />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {!mounted ? null : session ? (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-2 ring-zinc-800 hover:ring-zinc-700 transition-all"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-indigo-500/10 text-indigo-500">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 bg-gray-950 border border-zinc-800/50" align="end">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium text-zinc-200">{session.user?.name}</p>
                  <p className="text-xs text-zinc-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-zinc-800/50" />
                <DropdownMenuItem asChild className="focus:bg-indigo-500/10">
                  <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                {session.user?.role === "ATTENDEE" && !session.user?.onboardingCompleted && (
                  <DropdownMenuItem asChild className="focus:bg-indigo-500/10">
                    <Link href="/onboarding" className="cursor-pointer">Complete Profile</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-zinc-800/50" />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                  onClick={() => signOut()}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden sm:flex">
                <Button
                  variant="ghost"
                  asChild
                  className="text-zinc-300 hover:text-white hover:bg-indigo-500/10"
                >
                  <Link href="/auth/attendee/signin">Sign In</Link>
                </Button>
              </div>
              <Button
                asChild
                className="relative h-10 px-6 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 border-0 shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
              >
                <Link href="/auth/attendee/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-300 hover:text-white hover:bg-indigo-500/10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-gray-950 border-zinc-800/50"
              >
                <nav className="flex flex-col gap-4 mt-8">
                  {getNavItems().map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-zinc-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-indigo-500/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!session?.user && (
                    <>
                      <Link
                        href="/auth/attendee/signin"
                        className="text-zinc-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-indigo-500/10"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/attendee/signup"
                        className="text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 transition-colors px-4 py-2 rounded-lg"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
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
