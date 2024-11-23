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
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <div className="w-full max-w-md space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Organizer Sign In</h1>
          <p className="text-sm text-gray-400">
            Don&apos;t have an organizer account?{" "}
            <Link href="/auth/organizer/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Register as organizer
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
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
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          <Link href="/auth/attendee/signin" className="text-indigo-400 hover:text-indigo-300">
            Sign in as attendee instead
          </Link>
        </div>
      </div>
    </div>
  )
}
