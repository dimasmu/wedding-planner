"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Heart, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function NavAuth({ mobile }: { mobile?: boolean }) {
  const [user, setUser] = React.useState<{ name: string } | null | undefined>(undefined);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (user === undefined) return null;

  if (user) {
    return (
      <div className={mobile ? "flex flex-col gap-3" : "flex items-center gap-3"}>
        <span className={mobile ? "font-serif text-lg text-brand-taupe/60" : "text-sm text-brand-taupe/60"}>
          <UserIcon className="w-4 h-4 inline mr-1" />
          {user.name}
        </span>
        <Button
          variant="ghost"
          className={mobile ? "justify-start text-brand-taupe" : "text-brand-taupe hover:text-red-500"}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    );
  }

  if (mobile) {
    return (
      <>
        <Link href="/login" className="font-serif text-lg text-brand-taupe">Login</Link>
        <Link href="/dashboard" className="w-full">
          <Button className="w-full bg-brand-gold text-white">Start Planning</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button variant="ghost" className="text-brand-taupe hover:text-brand-gold">Login</Button>
      </Link>
      <Link href="/dashboard">
        <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300">
          Start Planning →
        </Button>
      </Link>
    </>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-sand bg-brand-cream/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-brand-gold fill-brand-gold" />
          <span className="font-serif text-xl font-bold tracking-wider text-brand-taupe">
            SOLA PLANNER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" className={navigationMenuTriggerStyle()}>
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className={navigationMenuTriggerStyle()}>
                About
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/services" className={navigationMenuTriggerStyle()}>
                Services
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/testimoni" className={navigationMenuTriggerStyle()}>
                Testimonials
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact-us" className={navigationMenuTriggerStyle()}>
                Contact Us
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/venue" className={navigationMenuTriggerStyle()}>
                Venue Catalog
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/inspiration" className={navigationMenuTriggerStyle()}>
                Inspiration
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" className={navigationMenuTriggerStyle()}>
                Pricing
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-4">
          <NavAuth />
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" className="px-2 text-brand-taupe" aria-label="Menu" />}
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-cream w-[300px]">
              <nav className="flex flex-col gap-6 mt-10">
                <Link href="/" className="font-serif text-lg text-brand-taupe">
                  Home
                </Link>
                <Link href="/about" className="font-serif text-lg text-brand-taupe">
                  About
                </Link>
                <Link href="/services" className="font-serif text-lg text-brand-taupe">
                  Services
                </Link>
                <Link href="/testimoni" className="font-serif text-lg text-brand-taupe">
                  Testimonials
                </Link>
                <Link href="/contact-us" className="font-serif text-lg text-brand-taupe">
                  Contact Us
                </Link>
                <Link href="/venue" className="font-serif text-lg text-brand-taupe">
                  Venue Catalog
                </Link>
                <Link href="/inspiration" className="font-serif text-lg text-brand-taupe">
                  Inspiration
                </Link>
                <Link href="/pricing" className="font-serif text-lg text-brand-taupe">
                  Pricing
                </Link>
                <hr className="border-brand-sand" />
                <NavAuth mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
