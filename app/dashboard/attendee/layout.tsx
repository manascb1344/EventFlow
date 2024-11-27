import { DashboardNav } from "@/components/nav";
import { SidebarNav } from "@/components/sidebar-nav";

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard/attendee",
    icon: "home",
  },
  {
    title: "My Events",
    href: "/dashboard/attendee/events",
    icon: "calendar",
  },
  {
    title: "My Tickets",
    href: "/dashboard/attendee/my-tickets",
    icon: "ticket",
  },
  {
    title: "Profile",
    href: "/dashboard/attendee/profile",
    icon: "user",
  },
  {
    title: "Settings",
    href: "/dashboard/attendee/settings",
    icon: "settings",
  },
];

interface AttendeeLayoutProps {
  children?: React.ReactNode;
}

export default function AttendeeLayout({ children }: AttendeeLayoutProps) {
  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
