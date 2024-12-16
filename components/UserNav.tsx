'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function UserNav() {
  const { data: session } = useSession();

  const getProfileItems = () => {
    if (session?.user?.role === "ORGANIZER") {
      return [
        {
          href: "/organizer/profile",
          label: "Organization Profile",
          shortcut: "Ctrl+Shift+P",
        },
        {
          href: "/organizer/billing",
          label: "Billing",
          shortcut: "Ctrl+B",
        },
        {
          href: "/organizer/team",
          label: "Team Members",
          shortcut: "Ctrl+T",
        },
      ];
    }

    return [
      {
        href: "/profile",
        label: "Profile",
        shortcut: "Ctrl+Shift+P",
      },
      {
        href: "/preferences",
        label: "Preferences",
        shortcut: "Ctrl+,",
      },
    ];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {getProfileItems().map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                {item.label}
                {item.shortcut && (
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Log out
          <DropdownMenuShortcut>Ctrl+Shift+Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
