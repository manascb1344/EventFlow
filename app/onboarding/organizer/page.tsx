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
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
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
      router.push("/auth/organizer/signin");
      return;
    }
    if (session.user?.role !== "ORGANIZER") {
      router.push("/");
      return;
    }
    if (session.user?.onboardingCompleted) {
      router.push("/dashboard/organizer");
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
      formData.append("phoneNumber", data.phoneNumber);
      if (data.bio) formData.append("bio", data.bio);

      const result = await completeOrganizerOnboarding(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          onboardingCompleted: true,
        }
      });

      // Wait a bit for the session to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push("/dashboard/organizer");
      router.refresh();
    } catch (error) {
      setError("Something went wrong");
    }
  };

  if (!session || session.user?.role !== "ORGANIZER") {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <div className="w-full max-w-lg mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <Input
                id="organization"
                placeholder="Event Masters Inc."
                className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
                {...register("organization")}
              />
              {errors.organization && (
                <p className="text-sm text-red-500">{errors.organization.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+91 99999 99999"
                className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Bio</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tell us about your organization and events you plan to host</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="bio"
                placeholder="Tell us about your organization..."
                className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors min-h-[100px]"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Completing Profile..." : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
