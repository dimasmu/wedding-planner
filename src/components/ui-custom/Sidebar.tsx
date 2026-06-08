"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  DollarSign,
  Users,
  Settings,
  Heart,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/dashboard/budget", label: "Budget", icon: DollarSign },
  { href: "/dashboard/guests", label: "Guest List", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all",
            pathname === href
              ? "bg-brand-gold/10 text-brand-gold font-medium"
              : "text-brand-taupe/70 hover:bg-brand-sand hover:text-brand-taupe"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-brand-sand bg-white min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Heart className="h-5 w-5 text-brand-gold fill-brand-gold" />
            <span className="font-serif text-lg font-bold tracking-wider text-brand-taupe">
              SOLA
            </span>
          </Link>
          <NavLinks />
        </div>
      </aside>

      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-brand-sand px-4 py-2">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" className="text-brand-taupe gap-2" />}
          >
            <Menu className="w-4 h-4" />
            {navItems.find((n) => n.href === pathname)?.label || "Menu"}
          </SheetTrigger>
          <SheetContent side="left" className="bg-white w-[260px]">
            <div className="mt-8">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
