'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, ArrowLeft } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { completeAttendeeOnboarding } from "@/lib/actions/auth"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

const attendeeOnboardingSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  interests: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  preferredPaymentMethod: z.string().optional(),
  notificationPreferences: z.boolean().default(true),
});

type OnboardingFormData = z.infer<typeof attendeeOnboardingSchema>;

const paymentMethods = [
  { value: "CARD", label: "Credit/Debit Card" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "WALLET", label: "Digital Wallet" },
];

export default function AttendeeOnboarding() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, update } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/attendee/signin");
      return;
    }
    if (session.user?.role !== "ATTENDEE") {
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
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(attendeeOnboardingSchema),
    defaultValues: {
      notificationPreferences: true,
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      const formData = new FormData();
      formData.append("phoneNumber", data.phoneNumber);
      if (data.interests) formData.append("interests", data.interests);
      if (data.dietaryRestrictions) formData.append("dietaryRestrictions", data.dietaryRestrictions);
      if (data.preferredPaymentMethod) formData.append("preferredPaymentMethod", data.preferredPaymentMethod);
      formData.append("notificationPreferences", data.notificationPreferences.toString());

      const result = await completeAttendeeOnboarding(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          onboardingCompleted: true
        }
      });
      
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("Onboarding error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  if (!session || session.user?.role !== "ATTENDEE") {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <div className="w-full max-w-lg mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-p2 text-p4 flex items-center justify-center">1</div>
            <span className="text-xs mt-1 text-p5">Account</span>
          </div>
          <div className="flex-1 flex items-center px-4">
            <div className="h-1 w-full bg-p2" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-p2 text-p4 flex items-center justify-center">2</div>
            <span className="text-xs mt-1 text-p5">Profile</span>
          </div>
          <div className="flex-1 flex items-center px-4">
            <div className="h-1 w-full bg-s3" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-s3 text-p5 flex items-center justify-center">3</div>
            <span className="text-xs mt-1 text-p5">Complete</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="h5 text-p4">Complete Your Profile</h1>
          <p className="body-3 text-p5 mt-2">Help us personalize your event experience</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-p4">
              Phone Number <span className="text-p1">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-p5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>We&apos;ll use this to send important event updates</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+91 99999 99999"
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-p1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests" className="flex items-center gap-2 text-p4">
              What interests you?
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-p5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Help us recommend events you&apos;ll love</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              id="interests"
              placeholder="Tech conferences, music festivals, workshops..."
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors min-h-[80px] resize-none"
              {...register("interests")}
            />
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions" className="flex items-center gap-2 text-p4">
              Any dietary requirements?
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-p5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>We&apos;ll ensure your dietary needs are met at events</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              id="dietaryRestrictions"
              placeholder="Vegetarian, gluten-free, allergies..."
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors min-h-[80px] resize-none"
              {...register("dietaryRestrictions")}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="preferredPaymentMethod" className="flex items-center gap-2 text-p4">
              Preferred Payment Method
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-p5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your default payment method for tickets</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Controller
              name="preferredPaymentMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/30 text-white">
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value} className="hover:bg-white/10 focus:bg-white/10">
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-s3 rounded-14">
            <div>
              <Label htmlFor="notificationPreferences" className="font-medium text-p4">Event Updates</Label>
              <p className="text-sm text-p5">Get notified about event changes and reminders</p>
            </div>
            <Controller
              name="notificationPreferences"
              control={control}
              render={({ field }) => (
                <Switch
                  id="notificationPreferences"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-p2 data-[state=unchecked]:bg-s5"
                />
              )}
            />
          </div>

          {error && (
            <div className="p-4 rounded-14 bg-p1/10 text-p1 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-s5 text-p4 hover:bg-s3"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-p2 text-p4 hover:bg-p2/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
