"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Bot, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "홈", href: "/", icon: Home },
  { label: "커뮤니티", href: "/community", icon: MessageSquare },
  { label: "AI봇", href: "/ai-bot", icon: Bot },
  { label: "리더보드", href: "/leaderboard", icon: Trophy },
  { label: "내정보", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background safe-bottom">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                active
                  ? "text-[#2E75B6] font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
