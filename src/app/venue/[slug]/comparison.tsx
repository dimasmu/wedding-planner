"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X as XIcon, Scale } from "lucide-react";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  features: string[];
  bookingUrl: string;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function PackageComparison({ venue }: { venue: { name: string; packages: PackageData[] } }) {
  const [selected, setSelected] = useState<number[]>([]);

  const togglePackage = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearComparison = () => setSelected([]);

  const selectedPackages = venue.packages.filter((p) =>
    selected.includes(p.id)
  );

  const allFeatures = [
    ...new Set(selectedPackages.flatMap((p) => p.features)),
  ];

  return (
    <>
      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {venue.packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`bg-white border-brand-sand shadow-sm transition-all duration-300 ${
              selected.includes(pkg.id)
                ? "ring-2 ring-brand-gold border-brand-gold"
                : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-brand-taupe font-semibold">
                  {pkg.name}
                </h3>
                <Badge className="bg-brand-gold/10 text-brand-gold border-none">
                  {pkg.pax} Pax
                </Badge>
              </div>

              <p className="text-2xl font-bold text-brand-taupe mb-4">
                {formatIDR(pkg.price)}
              </p>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-brand-taupe/70"
                  >
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <a
                  href={pkg.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-colors">
                    Pesan
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full border-brand-sand ${
                    selected.includes(pkg.id)
                      ? "border-brand-gold text-brand-gold"
                      : "text-brand-taupe/60"
                  }`}
                  onClick={() => togglePackage(pkg.id)}
                >
                  <Scale className="w-3 h-3 mr-1" />
                  {selected.includes(pkg.id)
                    ? "Hapus dari perbandingan"
                    : "Bandingkan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      {selectedPackages.length >= 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-brand-taupe">
              Perbandingan Paket
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-brand-taupe/60 hover:text-red-500"
              onClick={clearComparison}
            >
              <XIcon className="w-3 h-3 mr-1" /> Bersihkan Perbandingan
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-brand-sand shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-serif text-brand-taupe">
                    Fitur
                  </TableHead>
                  {selectedPackages.map((pkg) => (
                    <TableHead
                      key={pkg.id}
                      className="font-serif text-brand-taupe text-center"
                    >
                      {pkg.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-brand-taupe">
                    Pax
                  </TableCell>
                  {selectedPackages.map((pkg) => (
                    <TableCell
                      key={pkg.id}
                      className="text-center text-brand-taupe/70"
                    >
                      {pkg.pax}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-brand-taupe">
                    Harga
                  </TableCell>
                  {selectedPackages.map((pkg) => (
                    <TableCell
                      key={pkg.id}
                      className="text-center text-brand-gold font-semibold"
                    >
                      {formatIDR(pkg.price)}
                    </TableCell>
                  ))}
                </TableRow>
                {allFeatures.map((feature) => (
                  <TableRow key={feature}>
                    <TableCell className="text-brand-taupe/70">
                      {feature}
                    </TableCell>
                    {selectedPackages.map((pkg) => (
                      <TableCell key={pkg.id} className="text-center">
                        {pkg.features.includes(feature) ? (
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
