'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTransition } from "react"
import { getSettings, updateNotificationPreferences } from "../../_actions/settings"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"

export function NotificationForm() {
    const [isPending, startTransition] = useTransition()
    const [data, setData] = useState({ emailNotifications: false, pushNotifications: false })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getSettings()
            .then((settings) => setData({
                emailNotifications: settings.organizerSettings?.emailNotifications || false,
                pushNotifications: settings.organizerSettings?.pushNotifications || false,
            }))
            .catch(() => toast.error("Failed to load notification settings"))
            .finally(() => setLoading(false))
    }, [])

    function save() {
        startTransition(async () => {
            const result = await updateNotificationPreferences(data)
            if (result.error) toast.error(result.error)
            else toast.success("Notification preferences updated")
        })
    }

    if (loading) return <p className="text-sm text-s3">Loading...</p>

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="space-y-0.5">
                        <Label htmlFor="org-email-notifications" className="text-p4 font-medium">Email Notifications</Label>
                        <p className="text-sm text-s3">Receive email updates about your events</p>
                    </div>
                    <Switch
                        id="org-email-notifications"
                        checked={data.emailNotifications}
                        onCheckedChange={(value) => setData({ ...data, emailNotifications: value })}
                        className="data-[state=checked]:bg-p1 border-white/10"
                    />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="space-y-0.5">
                        <Label htmlFor="org-push-notifications" className="text-p4 font-medium">Push Notifications</Label>
                        <p className="text-sm text-s3">Receive push notifications about your events</p>
                    </div>
                    <Switch
                        id="org-push-notifications"
                        checked={data.pushNotifications}
                        onCheckedChange={(value) => setData({ ...data, pushNotifications: value })}
                        className="data-[state=checked]:bg-p1 border-white/10"
                    />
                </div>
            </div>
            <Button type="button" onClick={save} disabled={isPending} className="w-full sm:w-auto rounded-md bg-p1 font-semibold text-[#05121a] hover:bg-[#7bf6ff]">
                {isPending ? "Saving..." : "Save Preferences"}
            </Button>
        </div>
    )
}
