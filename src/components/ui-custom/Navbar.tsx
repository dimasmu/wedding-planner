"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Heart } from "lucide-react";
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
              <Link href="/vendors" className={navigationMenuTriggerStyle()}>
                Find Vendors
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
          <Link href="/login">
            <Button variant="ghost" className="text-brand-taupe hover:text-brand-gold">
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300">
              Start Planning →
            </Button>
          </Link>
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
                <Link href="/vendors" className="font-serif text-lg text-brand-taupe">
                  Find Vendors
                </Link>
                <Link href="/inspiration" className="font-serif text-lg text-brand-taupe">
                  Inspiration
                </Link>
                <Link href="/pricing" className="font-serif text-lg text-brand-taupe">
                  Pricing
                </Link>
                <hr className="border-brand-sand" />
                <Link href="/login" className="font-serif text-lg text-brand-taupe">
                  Login
                </Link>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full bg-brand-gold text-white">Start Planning</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
