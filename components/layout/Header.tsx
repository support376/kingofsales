"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-[#1B3A5C]">
          영업왕
        </Link>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
