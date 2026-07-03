import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

interface VenueCardProps {
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  cheapestPrice: number | null;
  image: string;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function VenueCard({
  slug,
  name,
  location,
  maxCapacity,
  cheapestPrice,
  image,
}: VenueCardProps) {
  return (
    <Link href={`/venue/${slug}`}>
      <Card className="bg-white border-brand-sand hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 overflow-hidden">
        <div className="relative h-48 w-full">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
              <span className="font-serif text-5xl text-brand-gold/30">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-serif text-lg text-brand-taupe font-semibold mb-2">
            {name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-brand-taupe/60 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {maxCapacity} pax
            </span>
          </div>
          {cheapestPrice && (
            <p className="text-sm">
              <span className="text-brand-taupe/60">Mulai dari </span>
              <span className="font-semibold text-brand-gold">
                {formatIDR(cheapestPrice)}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
