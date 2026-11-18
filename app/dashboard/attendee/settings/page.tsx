import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Settings | EventFlow",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/attendee/signin");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings and preferences."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose what updates you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Receive email updates about your registered events
                </span>
              </Label>
              <Switch 
                id="email-notifications" 
                className="border-white/10 data-[state=checked]:bg-p1" 
                defaultChecked
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                <span>Marketing Emails</span>
                <span className="text-sm text-muted-foreground">
                  Receive emails about new events and features
                </span>
              </Label>
              <Switch 
                id="marketing-emails" 
                className="border-white/10 data-[state=checked]:bg-p1" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>
              Manage your privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="public-profile" className="flex flex-col space-y-1">
                <span>Public Profile</span>
                <span className="text-sm text-muted-foreground">
                  Allow other users to see your profile
                </span>
              </Label>
              <Switch 
                id="public-profile" 
                className="border-white/10 data-[state=checked]:bg-p1" 
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="show-attendance" className="flex flex-col space-y-1">
                <span>Show Event Attendance</span>
                <span className="text-sm text-muted-foreground">
                  Show which events you&apos;re attending to other users
                </span>
              </Label>
              <Switch 
                id="show-attendance" 
                className="border-white/10 data-[state=checked]:bg-p1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                <span>Two-Factor Authentication</span>
                <span className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </span>
              </Label>
              <Switch 
                id="two-factor" 
                className="border-white/10 data-[state=checked]:bg-p1" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
