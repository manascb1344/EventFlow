'use client';

import { getProviders, signIn, ClientSafeProvider } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    fetchProviders()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        {providers &&
          Object.values(providers).map((provider: ClientSafeProvider) => (
            <Button
              key={provider.name}
              className="w-full"
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
              Sign in with {provider.name}
            </Button>
          ))}
      </div>
    </div>
  )
}