'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { register } from "./actions";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, password);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        role: 'ATTENDEE',
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      window.location.href = '/dashboard';
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an Account</h1>
          <p className="text-muted-foreground">Sign up to attend amazing events</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold border-2 border-primary-foreground/20 h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>

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
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            disabled={isLoading}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/attendee/signin" className="text-primary hover:text-primary/90 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}