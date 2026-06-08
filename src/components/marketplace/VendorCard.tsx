"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign } from "lucide-react";
import { Vendor } from "@/lib/types/vendor";

interface VendorCardProps {
  vendor: Vendor;
  onClick: (vendor: Vendor) => void;
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="bg-white border-brand-sand hover:shadow-lg cursor-pointer transition-shadow overflow-hidden"
        onClick={() => onClick(vendor)}
      >
        <div className="h-48 bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
          <span className="font-serif text-5xl text-brand-gold/30">
            {vendor.name.charAt(0)}
          </span>
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-serif text-lg text-brand-taupe font-semibold">
              {vendor.name}
            </h3>
            <Badge variant="outline" className="border-brand-gold text-brand-gold text-xs">
              {vendor.category}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-brand-taupe/60 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {vendor.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-brand-gold text-brand-gold" /> {vendor.rating} ({vendor.reviews})
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-3 h-3 text-brand-gold" />
            <span className="text-brand-taupe/70">From </span>
            <span className="font-semibold text-brand-taupe">
              ${vendor.priceFrom.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
