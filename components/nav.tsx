import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface DashboardNavProps {
  items: {
    title: string;
    href: string;
    icon?: string;
  }[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const isActive = path === item.href;
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent" : "transparent",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
