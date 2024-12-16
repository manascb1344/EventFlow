'use client';

import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export function Search() {
  const { data: session } = useSession();

  if (session?.user?.role === "ORGANIZER") {
    return null;
  }

  return (
    <div>
      <Input
        type="search"
        placeholder="Search events..."
        className="h-9 md:w-[300px] lg:w-[400px]"
      />
    </div>
  );
}
