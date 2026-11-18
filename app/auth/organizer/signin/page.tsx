'use client';

import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from 'next/link';

const organizerSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type OrganizerSignInFormData = z.infer<typeof organizerSignInSchema>;

export default function OrganizerSignIn() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.role === "ORGANIZER") {
      router.push("/dashboard/organizer")
    }
  }, [session, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizerSignInFormData>({
    resolver: zodResolver(organizerSignInSchema),
  });

  const onSubmit = async (data: OrganizerSignInFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: "ORGANIZER",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard/organizer");
      router.refresh();
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Organizer Sign In</h1>
          <p className="text-muted-foreground">
            Don&apos;t have an organizer account?{" "}
            <Link href="/auth/organizer/signup" className="text-primary hover:text-primary/90 font-medium">
              Register as organizer
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              {...register("email")}
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
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold border-2 border-primary-foreground/20 h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-3 border-current border-t-transparent" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
