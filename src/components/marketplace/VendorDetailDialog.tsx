"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, MapPin, DollarSign } from "lucide-react";
import { Vendor } from "@/lib/types/vendor";
import { toast } from "sonner";

interface VendorDetailDialogProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorDetailDialog({ vendor, open, onOpenChange }: VendorDetailDialogProps) {
  const [quoteMessage, setQuoteMessage] = useState("");

  if (!vendor) return null;

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    toast(`${vendor.name} will get back to you within 24 hours.`);
    setQuoteMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="font-serif text-2xl text-brand-taupe">
                {vendor.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-brand-taupe/70">
                  <MapPin className="w-4 h-4" /> {vendor.location}
                </span>
                <span className="flex items-center gap-1 text-brand-gold">
                  <Star className="w-4 h-4 fill-brand-gold" /> {vendor.rating} ({vendor.reviews} reviews)
                </span>
              </DialogDescription>
            </div>
            <Badge className="bg-brand-gold text-white">{vendor.category}</Badge>
          </div>
        </DialogHeader>

        <div className="h-56 bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 rounded-lg flex items-center justify-center">
          <span className="font-serif text-7xl text-brand-gold/20">{vendor.name.charAt(0)}</span>
        </div>

        <p className="text-brand-taupe/70 leading-relaxed">{vendor.description}</p>

        <div className="bg-brand-sand rounded-lg p-4 flex items-center justify-between">
          <span className="text-brand-taupe/70">Starting Price</span>
          <span className="font-serif text-2xl text-brand-taupe font-bold">
            ${vendor.priceFrom.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {vendor.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-brand-sand text-brand-taupe/60 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <form onSubmit={handleRequestQuote} className="space-y-4 border-t border-brand-sand pt-6">
          <h4 className="font-serif text-lg text-brand-taupe">Request a Quote</h4>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-brand-taupe">
              Describe your needs
            </Label>
            <Input
              id="message"
              placeholder="e.g., Wedding date, estimated guests, specific requirements..."
              value={quoteMessage}
              onChange={(e) => setQuoteMessage(e.target.value)}
              className="border-brand-sand"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-all"
          >
            Send Quote Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
