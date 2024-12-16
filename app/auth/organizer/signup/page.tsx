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

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.name);
      formData.append("role", "ORGANIZER");

      const result = await register(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Sign in the user after successful registration
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

      // Redirect to the onboarding page based on role
      router.push(`/onboarding/organizer`);
      router.refresh();
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an Organizer Account</h1>
          <p className="text-muted-foreground">Sign up to start organizing events</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              {...registerField("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              {...registerField("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              {...registerField("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              {...registerField("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold border-2 border-primary-foreground/20 h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-3 border-current border-t-transparent" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/organizer/signin" className="text-primary hover:text-primary/90 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
