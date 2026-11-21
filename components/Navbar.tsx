"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { MainNav } from "./MainNav"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfileImage } from "@/app/actions/profile"

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [profileImage, setProfileImage] = React.useState<string | null>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    const loadProfileImage = async () => {
      if (session?.user) {
        const image = await getProfileImage()
        setProfileImage(image)
      }
    }
    loadProfileImage()
  }, [session])

  const getNavItems = () => {
    if (!mounted || status === "loading" || !session) {
      return [
        { href: "/features", label: "Features" },
        { href: "/events", label: "Events" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ];
    }

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
        { href: "/dashboard/attendee/my-tickets", label: "My Tickets" },
        { href: "/dashboard/attendee/saved-events", label: "Saved Events" },
        { href: "/dashboard/attendee/profile", label: "Profile" },
      ];
    }

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
          ? "border-b border-white/10 bg-[#080b10]/85 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-bold tracking-tight text-[#f4f5f7]">EventFlow</span>
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
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profileImage || session?.user?.image || undefined} alt="Profile" />
                    <AvatarFallback>{session?.user?.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
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
                <DropdownMenuItem asChild className="focus:bg-p1/10">
                  <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                {session.user?.role === "ATTENDEE" && !session.user?.onboardingCompleted && (
                  <DropdownMenuItem asChild className="focus:bg-p1/10">
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
                  className="text-zinc-300 hover:text-white hover:bg-p1/10"
                >
                  <Link href="/auth/attendee/signin">Sign In</Link>
                </Button>
              </div>
              <Button
                asChild
                className="h-10 rounded-md bg-p1 px-5 text-sm font-semibold text-[#05121a] hover:bg-[#7bf6ff]"
              >
                <Link href="/auth/attendee/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-300 hover:text-white hover:bg-p1/10"
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
                      className="text-zinc-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-p1/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!session?.user && (
                    <>
                      <Link
                        href="/auth/attendee/signin"
                        className="text-zinc-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-p1/10"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/attendee/signup"
                        className="rounded-md bg-p1 px-4 py-2 font-semibold text-[#05121a] hover:bg-[#7bf6ff]"
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
