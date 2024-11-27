import { db } from "@/lib/db/drizzle";
import { organizers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrganizerProfile(organizerId: number, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      organization: formData.get("organization") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      bio: formData.get("bio") as string,
      profileImage: formData.get("profileImage") as string,
    };

    await db.update(organizers)
      .set(data)
      .where(eq(organizers.id, organizerId));
    
    revalidatePath("/dashboard/organizer");
    return { success: true };
  } catch (error) {
    console.error("Error updating organizer profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function updateStripeConnectAccount(organizerId: number, stripeConnectAccountId: string) {
  try {
    await db.update(organizers)
      .set({ stripeConnectAccountId })
      .where(eq(organizers.id, organizerId));
    return { success: true };
  } catch (error) {
    console.error("Error updating Stripe Connect account:", error);
    return { error: "Failed to update Stripe Connect account" };
  }
}

export async function completeOnboarding(organizerId: number) {
  try {
    await db.update(organizers)
      .set({ onboardingCompleted: true })
      .where(eq(organizers.id, organizerId));
    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { error: "Failed to complete onboarding" };
  }
}

export async function getOrganizerProfile(organizerId: number) {
  try {
    const profile = await db.query.organizers.findFirst({
      where: eq(organizers.id, organizerId),
      columns: {
        password: false,
      },
    });
    
    if (!profile) {
      return { error: "Organizer not found" };
    }

    return { success: true, profile };
  } catch (error) {
    console.error("Error fetching organizer profile:", error);
    return { error: "Failed to fetch profile" };
  }
}
