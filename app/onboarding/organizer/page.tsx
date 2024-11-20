'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { completeOrganizerOnboarding } from "@/lib/actions/auth"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

const organizerOnboardingSchema = z.object({
  organization: z.string().min(2, "Organization name is required"),
  bio: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof organizerOnboardingSchema>;

export default function OrganizerOnboarding() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, update } = useSession()

  // Redirect if user is not authenticated or is not an organizer
  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (session.user?.role !== "ORGANIZER") {
      router.push("/dashboard");
      return;
    }
    if (session.user?.onboardingCompleted) {
      router.push("/dashboard");
      return;
    }
  }, [session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(organizerOnboardingSchema),
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      const formData = new FormData();
      formData.append("organization", data.organization);
      if (data.bio) formData.append("bio", data.bio);

      const result = await completeOrganizerOnboarding(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Update the session to reflect completed onboarding
      await update({ onboardingCompleted: true });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Something went wrong");
    }
  };

  if (!session || session.user?.role !== "ORGANIZER") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="w-full max-w-lg mx-auto space-y-8">
          {/* Progress indicator */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div className="bg-primary h-2 rounded-full w-3/4" />
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <button 
              onClick={() => router.back()} 
              className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Complete Organization Profile</h1>
            <p className="text-muted-foreground">Tell us about your organization to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Organization Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="organization" className="text-sm font-medium">Organization Name *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This will be displayed on your events and profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="organization"
                placeholder="Enter your organization name"
                className="w-full"
                {...register("organization")}
              />
              {errors.organization && (
                <p className="text-sm text-destructive">{errors.organization.message}</p>
              )}
            </div>

            {/* Organization Bio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio" className="text-sm font-medium">Organization Bio</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tell attendees about your organization and the events you host</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="bio"
                placeholder="E.g., We are a tech community organizing workshops and conferences..."
                className="min-h-[150px]"
                {...register("bio")}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                  Saving...
                </div>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
