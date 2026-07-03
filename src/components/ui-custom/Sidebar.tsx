"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  DollarSign,
  Users,
  Building2,
  UserCog,
  Settings,
  Heart,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const allNavItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/checklist", label: "Checklist", icon: ClipboardCheck, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/budget", label: "Budget", icon: DollarSign, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/guests", label: "Guest List", icon: Users, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/venues", label: "Venues", icon: Building2, roles: ["admin", "editor"] },
  { href: "/dashboard/users", label: "Users", icon: UserCog, roles: ["admin"] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["admin", "editor", "couple"] },
];

function NavLinks({ pathname, role }: { pathname: string; role: string | null }) {
  const navItems = allNavItems.filter((item) => role && item.roles.includes(role));

  return (
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
}

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRole(data?.user?.role || null))
      .catch(() => setRole(null));
  }, []);

  const activeLabel = allNavItems.find((n) => n.href === pathname)?.label || "Menu";

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
          <NavLinks pathname={pathname} role={role} />
        </div>
      </aside>

      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-brand-sand px-4 py-2">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" className="text-brand-taupe gap-2" />}
          >
            <Menu className="w-4 h-4" />
            {activeLabel}
          </SheetTrigger>
          <SheetContent side="left" className="bg-white w-[260px]">
            <div className="mt-8">
              <NavLinks pathname={pathname} role={role} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
