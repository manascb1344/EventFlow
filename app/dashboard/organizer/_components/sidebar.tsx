"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  CalendarDays, 
  LayoutDashboard, 
  Users, 
  Ticket, 
  MessageSquare,
  BarChart3,
  Settings
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard/organizer",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    href: "/dashboard/organizer/events",
    icon: CalendarDays,
  },
  {
    title: "Analytics",
    href: "/dashboard/organizer/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/organizer/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50",
                  pathname === item.href
                    ? "bg-accent/50 text-accent-foreground"
                    : "text-muted-foreground hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
