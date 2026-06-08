import Link from "next/link";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-5 w-5 text-brand-gold fill-brand-gold" />
              <span className="font-serif text-lg font-bold tracking-wider">
                SOLA PLANNER
              </span>
            </Link>
            <p className="text-brand-cream/60 text-sm leading-relaxed">
              Your dream wedding, effortlessly planned. Trusted by couples across the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/vendors" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Find Vendors
              </Link>
              <Link href="/inspiration" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Inspiration
              </Link>
              <Link href="/pricing" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider">
              Account
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Register
              </Link>
              <Link href="/dashboard" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider">
              Stay Inspired
            </h4>
            <p className="text-sm text-brand-cream/60 mb-3">
              Get wedding planning tips and vendor deals.
            </p>
            <form
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Your email"
                className="bg-brand-cream/10 border-brand-cream/20 text-brand-cream placeholder:text-brand-cream/40 text-sm h-9"
              />
              <Button
                type="submit"
                className="bg-brand-gold text-white hover:bg-brand-gold/80 text-sm h-9 px-4 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-brand-cream/10 mt-12 pt-8 text-center text-sm text-brand-cream/40">
          &copy; {new Date().getFullYear()} Sola Planner. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
