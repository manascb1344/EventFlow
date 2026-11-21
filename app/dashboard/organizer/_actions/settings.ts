'use server'

import { authOptions } from "@/lib/auth/authOptions"
import { db } from "@/lib/db/drizzle"
import { organizers } from "@/lib/db/schema"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type SettingsData = {
    name: string
    bio: string | null
    contactEmail: string | null
    organizerSettings: {
        emailNotifications: boolean
        pushNotifications: boolean
    } | null
}

async function currentOrganizerId() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }
    return Number(session.user.id)
}

export async function getSettings(): Promise<SettingsData> {
    const organizerId = await currentOrganizerId()
    const [organizer] = await db.select().from(organizers).where(eq(organizers.id, organizerId)).limit(1)
    if (!organizer) {
        throw new Error("Organizer not found")
    }
    return {
        name: organizer.name,
        bio: organizer.bio,
        contactEmail: organizer.email,
        organizerSettings: {
            emailNotifications: organizer.emailNotifications ?? true,
            pushNotifications: organizer.pushNotifications ?? false
        }
    }
}

export async function updateOrganizerProfile(formData: FormData) {
    try {
        const organizerId = await currentOrganizerId()
        const name = String(formData.get("name") ?? "")
        const bio = String(formData.get("bio") ?? "")
        const contactEmail = String(formData.get("contactEmail") ?? "")

        await db.update(organizers).set({
            name,
            bio,
            email: contactEmail,
            updatedAt: new Date()
        }).where(eq(organizers.id, organizerId))

        revalidatePath("/dashboard/organizer/settings")
        return { success: true }
    } catch (error) {
        console.error("[SETTINGS_UPDATE_ERROR]", error)
        return { error: "Something went wrong" }
    }
}

export async function updateNotificationPreferences(preferences: { emailNotifications: boolean; pushNotifications: boolean }) {
    try {
        const organizerId = await currentOrganizerId()
        const emailNotifications = preferences.emailNotifications
        const pushNotifications = preferences.pushNotifications

        await db.update(organizers).set({
            emailNotifications,
            pushNotifications,
            updatedAt: new Date()
        }).where(eq(organizers.id, organizerId))

        revalidatePath("/dashboard/organizer/settings")
        return { success: true }
    } catch (error) {
        console.error("[NOTIFICATION_UPDATE_ERROR]", error)
        return { error: "Something went wrong" }
    }
}
