"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          {user?.email && (
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}