'use server'

import { authOptions } from "@/lib/auth/authOptions"
import { db } from "@/lib/db/drizzle"
import { getServerSession } from "next-auth"
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

export async function getSettings() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const user = await db.user.findUnique({
            where: {
                id: session.user.id
            },
            include: {
                organizerSettings: true
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        return {
            name: user.name,
            bio: user.bio,
            contactEmail: user.contactEmail,
            organizerSettings: user.organizerSettings
        } as SettingsData
    } catch (error) {
        console.error("[GET_SETTINGS_ERROR]", error)
        throw error
    }
}

export async function updateOrganizerProfile(formData: FormData) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const name = formData.get("name") as string
        const bio = formData.get("bio") as string
        const contactEmail = formData.get("contactEmail") as string

        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name,
                bio,
                contactEmail
            }
        })

        revalidatePath("/dashboard/organizer/settings")
        return { success: true }
    } catch (error) {
        console.error("[SETTINGS_UPDATE_ERROR]", error)
        return { error: "Something went wrong" }
    }
}

export async function updateNotificationPreferences(formData: FormData) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const emailNotifications = formData.get("emailNotifications") === "true"
        const pushNotifications = formData.get("pushNotifications") === "true"

        await db.organizerSettings.upsert({
            where: {
                userId: session.user.id
            },
            create: {
                userId: session.user.id,
                emailNotifications,
                pushNotifications
            },
            update: {
                emailNotifications,
                pushNotifications
            }
        })

        revalidatePath("/dashboard/organizer/settings")
        return { success: true }
    } catch (error) {
        console.error("[NOTIFICATION_UPDATE_ERROR]", error)
        return { error: "Something went wrong" }
    }
}
