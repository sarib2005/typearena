"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/leaderboard", label: "leaderboard" },
  { href: "/about", label: "about" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between mb-8 sm:mb-16">
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/">
          <h1 className="font-display font-bold text-lg sm:text-xl tracking-tight leading-none">
            TypingArena
          </h1>
        </Link>
      </div>
      <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:text-foreground transition-colors ${
              pathname === item.href ? "text-foreground" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/signin"
          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-md border border-border hover:border-primary hover:text-foreground transition-all text-xs sm:text-sm"
        >
          sign in
        </Link>
      </nav>
    </header>
  );
}