import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="font-bold">HackySoft</span>
        </Link>
        <MainNav />
        <div className="ml-auto border-l pl-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}