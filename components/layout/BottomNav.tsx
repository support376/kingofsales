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
  { label: "MY", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-bottom">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-gray-900"
                  : "text-gray-400"
              )}
            >
              <Icon className={cn("h-[22px] w-[22px]", active && "stroke-[2.5px]")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
