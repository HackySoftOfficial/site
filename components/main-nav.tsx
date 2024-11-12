"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const TEAM_MEMBERS = ["andrexyt", "catdrout"];

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/projects",
    label: "Projects",
  },
  {
    href: "#",
    label: "Team",
    isTeamLink: true,
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/chat",
    label: "Chat",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent, route: typeof routes[0]) => {
    if (route.isTeamLink) {
      e.preventDefault();
      const randomMember = TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)];
      router.push(`/team/${randomMember}`);
    }
  };

  return (
    <nav className="flex items-center space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          onClick={(e) => handleClick(e, route)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === route.href || 
            (route.isTeamLink && pathname.startsWith('/team'))
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}