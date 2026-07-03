"use client";

import { useState } from "react";
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
import { motion, AnimatePresence } from "motion/react";
import { Check, X as XIcon, Scale, Sparkles, Users, DollarSign, ChevronRight } from "lucide-react";

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
  const selectedPackages = venue.packages.filter((p) => selected.includes(p.id));
  const allFeatures = [...new Set(selectedPackages.flatMap((p) => p.features))];

  return (
    <>
      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venue.packages.map((pkg, i) => {
          const isSelected = selected.includes(pkg.id);
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className={`relative bg-white rounded-3xl shadow-lg shadow-brand-dark/3 border transition-all duration-300 overflow-hidden group ${
                  isSelected
                    ? "ring-2 ring-brand-gold border-brand-gold shadow-xl shadow-brand-gold/5"
                    : "border-brand-sand/50 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60" />

                <div className="p-8">
                  {/* Package name + Pax */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-brand-taupe font-semibold mb-1">
                        {pkg.name}
                      </h3>
                      <Badge className="bg-brand-gold/10 text-brand-gold border-none text-xs font-medium">
                        <Users className="w-3 h-3 mr-1" /> {pkg.pax} Pax
                      </Badge>
                    </div>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="shrink-0 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                      </motion.span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-brand-sand/50">
                    <p className="text-xs text-brand-taupe/40 uppercase tracking-wider mb-1">Harga Paket</p>
                    <p className="text-2xl font-bold text-brand-taupe">
                      {formatIDR(pkg.price)}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-brand-taupe/65">
                        <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="space-y-2.5">
                    <a
                      href={pkg.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-all duration-300 rounded-xl py-6 text-sm font-medium group/btn">
                        Pesan Sekarang
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full rounded-xl py-5 text-sm transition-all duration-200 ${
                        isSelected
                          ? "border-brand-gold text-brand-gold bg-brand-gold/5"
                          : "border-brand-sand text-brand-taupe/50 hover:text-brand-taupe hover:border-brand-gold/30"
                      }`}
                      onClick={() => togglePackage(pkg.id)}
                    >
                      <Scale className="w-3.5 h-3.5 mr-1.5" />
                      {isSelected ? "Hapus dari perbandingan" : "Bandingkan"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <AnimatePresence>
        {selectedPackages.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-12 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl text-brand-taupe">Perbandingan Paket</h3>
                <p className="text-sm text-brand-taupe/50 mt-1">
                  Bandingkan {selectedPackages.length} paket secara berdampingan
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-brand-taupe/50 hover:text-red-500 rounded-xl"
                onClick={clearComparison}
              >
                <XIcon className="w-3.5 h-3.5 mr-1.5" /> Bersihkan
              </Button>
            </div>

            <div className="bg-white rounded-2xl border border-brand-sand/50 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-serif text-brand-taupe bg-brand-cream/50 w-48">
                        Fitur
                      </TableHead>
                      {selectedPackages.map((pkg) => (
                        <TableHead
                          key={pkg.id}
                          className="font-serif text-brand-taupe text-center bg-brand-cream/50 min-w-[180px]"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span>{pkg.name}</span>
                            <Badge className="bg-brand-gold/10 text-brand-gold border-none text-xs">
                              {pkg.pax} Pax
                            </Badge>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-brand-taupe">Harga</TableCell>
                      {selectedPackages.map((pkg) => (
                        <TableCell key={pkg.id} className="text-center">
                          <span className="text-brand-gold font-semibold">{formatIDR(pkg.price)}</span>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-brand-taupe">Kapasitas</TableCell>
                      {selectedPackages.map((pkg) => (
                        <TableCell key={pkg.id} className="text-center text-brand-taupe/70">
                          <Users className="w-3.5 h-3.5 inline mr-1" />
                          {pkg.pax} Tamu
                        </TableCell>
                      ))}
                    </TableRow>
                    {allFeatures.map((feature) => (
                      <TableRow key={feature} className="hover:bg-brand-cream/30">
                        <TableCell className="text-brand-taupe/70">{feature}</TableCell>
                        {selectedPackages.map((pkg) => (
                          <TableCell key={pkg.id} className="text-center">
                            {pkg.features.includes(feature) ? (
                              <Check className="w-5 h-5 text-brand-gold mx-auto" />
                            ) : (
                              <XIcon className="w-5 h-5 text-brand-sand/50 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
