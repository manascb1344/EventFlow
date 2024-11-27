'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTransition } from "react"
import { getSettings, updateOrganizerProfile } from "../../_actions/settings"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"

export function SettingsForm() {
    const [isPending, startTransition] = useTransition()
    const [data, setData] = useState({
        name: "",
        bio: "",
        contactEmail: ""
    })

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await getSettings()
                setData({
                    name: settings.name || "",
                    bio: settings.bio || "",
                    contactEmail: settings.contactEmail || ""
                })
            } catch (error) {
                toast.error("Failed to load settings")
            }
        }

        loadSettings()
    }, [])

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await updateOrganizerProfile(formData)
            
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Settings updated successfully")
            }
        })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
                <div className="grid gap-3">
                    <Label htmlFor="name" className="text-p4 font-medium">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={data.name}
                        placeholder="Your name"
                        className="h-12 bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors"
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="bio" className="text-p4 font-medium">Bio</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={data.bio}
                        placeholder="Tell us about yourself"
                        className="min-h-[120px] bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors"
                        rows={4}
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="contactEmail" className="text-p4 font-medium">Contact Email</Label>
                    <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        defaultValue={data.contactEmail}
                        placeholder="contact@example.com"
                        className="h-12 bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors"
                    />
                </div>
            </div>

            <Button 
                type="submit" 
                disabled={isPending}
                className="w-full sm:w-auto bg-p1 hover:bg-p1/90 text-white"
            >
                {isPending ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}
