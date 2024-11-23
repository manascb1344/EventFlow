'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { register } from "./actions";

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
    <div className="flex min-h-screen items-center justify-center relative">
      <div className="w-full max-w-md space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Sign Up</h1>
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/attendee/signin" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                minLength={8}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
                minLength={8}
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent text-white rounded-full mr-2" />
            ) : null}
            Sign up
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          {isLoading ? (
            <div className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent text-white rounded-full mr-2" />
          ) : null}
          Continue with Google
        </Button>
      </div>
    </div>
  );
}