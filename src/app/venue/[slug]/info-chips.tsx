import { MapPin, Users, Package2, Banknote } from "lucide-react";

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

interface InfoChipsProps {
  location: string;
  maxCapacity: number;
  packageCount: number;
  cheapestPrice: number | null;
}

export function InfoChips({ location, maxCapacity, packageCount, cheapestPrice }: InfoChipsProps) {
  const chips: { icon: typeof MapPin; label: string }[] = [
    { icon: MapPin, label: location },
    { icon: Users, label: `${maxCapacity} tamu` },
    { icon: Package2, label: `${packageCount} paket` },
  ];
  if (cheapestPrice !== null) {
    chips.push({ icon: Banknote, label: `Mulai ${formatIDR(cheapestPrice)}` });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-sand/60 bg-white text-sm text-brand-taupe/70 shrink-0 hover:border-brand-gold/30 transition-colors"
          >
            <chip.icon className="w-4 h-4 text-brand-gold/60" />
            <span>{chip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
