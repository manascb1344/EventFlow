'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        <Button
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          Sign up with Google
        </Button>
      </div>
    </div>
  );
}