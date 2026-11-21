import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { getAttendeeSettings } from "./actions";
import { AttendeeSettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings | EventFlow",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/attendee/signin");
  }
  if (session.user.role !== "ATTENDEE") {
    redirect("/dashboard");
  }

  const settings = await getAttendeeSettings();
  if (!settings) {
    redirect("/auth/attendee/signin");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings and preferences."
      />
      <AttendeeSettingsForm initial={settings} />
    </DashboardShell>
  );
}
