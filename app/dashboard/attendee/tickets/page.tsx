import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Tickets | EventFlow",
  description: "View and manage your event tickets",
};

export default async function TicketsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Tickets"
        text="View and manage your event tickets."
      />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="mb-2 text-lg font-semibold">No Active Tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don&apos;t have any active tickets. Register for an event to get started!
              </p>
              <Button variant="outline" asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Your past event tickets will appear here.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
