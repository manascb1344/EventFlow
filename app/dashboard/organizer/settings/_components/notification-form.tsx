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
    const [data, setData] = useState({
        emailNotifications: false,
        pushNotifications: false
    })

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await getSettings()
                setData({
                    emailNotifications: settings.organizerSettings?.emailNotifications || false,
                    pushNotifications: settings.organizerSettings?.pushNotifications || false
                })
            } catch {
                toast.error("Failed to load notification settings")
            }
        }

        loadSettings()
    }, [])

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await updateNotificationPreferences(formData)
            
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Notification preferences updated")
            }
        })
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                void onSubmit(new FormData(event.currentTarget));
            }}
            className="space-y-8"
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="space-y-0.5">
                        <Label className="text-p4 font-medium">Email Notifications</Label>
                        <p className="text-sm text-s3">
                            Receive email updates about your events
                        </p>
                    </div>
                    <Switch
                        name="emailNotifications"
                        defaultChecked={data.emailNotifications}
                        className="data-[state=checked]:bg-p1 border-white/10"
                    />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="space-y-0.5">
                        <Label className="text-p4 font-medium">Push Notifications</Label>
                        <p className="text-sm text-s3">
                            Receive push notifications about your events
                        </p>
                    </div>
                    <Switch
                        name="pushNotifications"
                        defaultChecked={data.pushNotifications}
                        className="data-[state=checked]:bg-p1 border-white/10"
                    />
                </div>
            </div>

            <Button 
                type="submit" 
                disabled={isPending}
                className="w-full sm:w-auto bg-p1 hover:bg-p1/90 text-white"
            >
                {isPending ? "Saving..." : "Save Preferences"}
            </Button>
        </form>
    )
}
