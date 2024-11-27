import { Metadata } from "next"
import { Sidebar } from "./_components/sidebar"

export const metadata: Metadata = {
  title: "Organizer Dashboard | EventFlow",
  description: "Manage your events and track performance",
}

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <Sidebar />
        <main className="flex w-full flex-col overflow-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
