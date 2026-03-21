"use client";

import Link from "next/link";
import { Bell, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-[#1B3A5C]">
          영업왕
        </Link>
        <div className="flex items-center gap-2">
          {!loading && (
            user ? (
              <>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Bell className="h-5 w-5" />
                </Button>
                <Link href="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-[#2E75B6] text-white">
                      {user.nickname?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline" className="gap-1">
                  <LogIn className="h-4 w-4" />
                  로그인
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
