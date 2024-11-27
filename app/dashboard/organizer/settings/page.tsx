'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "./_components/settings-form"
import { NotificationForm } from "./_components/notification-form"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"

export default function SettingsPage() {
    const { data: session, status } = useSession()

    if (status === "unauthenticated") {
        redirect("/auth/signin")
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (!session?.user) {
        return null
    }

    return (
        <DashboardShell>
            <div className="flex flex-col gap-8">
                <DashboardHeader
                    heading="Settings"
                    text="Manage your organizer profile and preferences"
                />
                
                <div className="grid gap-6">
                    <Card className="border-white/10 bg-black-100/40 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/10 pb-4">
                            <CardTitle className="text-p1 font-semibold">Profile Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <SettingsForm />
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-black-100/40 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/10 pb-4">
                            <CardTitle className="text-p1 font-semibold">Notification Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <NotificationForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    )
}
