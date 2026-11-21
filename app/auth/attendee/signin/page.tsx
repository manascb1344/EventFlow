'use client';

import { getProviders, signIn, ClientSafeProvider } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    fetchProviders()
  }, [])

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h1>
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/attendee/signup" className="text-primary hover:text-primary/90 font-medium">
              Sign up
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
              autoComplete="current-password"
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
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </Button>

          {providers?.google && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-white/20 hover:border-p1/60 bg-transparent text-white transition-colors flex items-center justify-center gap-2"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                disabled={isSubmitting}
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}