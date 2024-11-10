"use client";

import { ModeToggle } from "@/components/mode-toggle";

export function AdminHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}