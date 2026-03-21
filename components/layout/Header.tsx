"use client";

import Link from "next/link";
import { Bell, LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="mx-auto flex h-12 max-w-lg items-center justify-between px-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900">
          영업왕
        </Link>
        <div className="flex items-center gap-1">
          {!loading && (
            user ? (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <Search className="h-[18px] w-[18px]" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <Bell className="h-[18px] w-[18px]" />
                </Button>
                <Link href="/profile">
                  <Avatar className="h-7 w-7 ml-1">
                    <AvatarFallback className="text-[11px] font-bold bg-blue-600 text-white">
                      {user.nickname?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="ghost" className="text-blue-600 font-medium text-sm h-8">
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
