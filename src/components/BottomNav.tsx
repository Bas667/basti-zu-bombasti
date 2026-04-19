"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Heute", icon: "home" },
  { href: "/exercises", label: "Uebungen", icon: "list" },
  { href: "/workout/new", label: "Neu", icon: "plus" },
  { href: "/stats", label: "Stats", icon: "stats" },
] as const;

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#FF6B00" : "currentColor";
  switch (icon) {
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "list":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "plus":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case "stats":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    default:
      return null;
  }
}

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.includes("/player")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dark border-t border-white/5">
      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                active
                  ? "text-accent"
                  : "text-light/30 hover:text-light/50"
              }`}
            >
              <NavIcon icon={item.icon} active={active} />
              <span className="font-headline text-[9px] uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
