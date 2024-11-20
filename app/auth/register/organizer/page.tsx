'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { register } from "@/lib/actions/auth"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

const organizerRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().min(2, "Organization name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type OrganizerRegisterFormData = z.infer<typeof organizerRegisterSchema>;

export default function OrganizerRegister() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizerRegisterFormData>({
    resolver: zodResolver(organizerRegisterSchema),
  });

  const onSubmit = async (data: OrganizerRegisterFormData) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.name);
      formData.append("role", "ORGANIZER");
      formData.append("organization", data.organization);

      const result = await register(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Sign in the organizer after successful registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: "ORGANIZER",
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Failed to sign in after registration");
        return;
      }

      // Redirect to onboarding first
      router.push("/onboarding/organizer");
      router.refresh();
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create an Organizer Account</h1>
          <p className="text-zinc-400">Sign up to start organizing events</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...registerField("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization Name</Label>
            <Input
              id="organization"
              placeholder="Event Masters Inc."
              {...registerField("organization")}
            />
            {errors.organization && (
              <p className="text-sm text-red-500">{errors.organization.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...registerField("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...registerField("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...registerField("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-sm text-center text-zinc-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
