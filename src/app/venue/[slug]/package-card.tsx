"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  content: string;
  bookingUrl: string;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function PackageCard({ pkg }: { pkg: PackageData }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Card */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-8 hover:border-brand-gold/30 hover:shadow-md transition-all duration-300 flex flex-col text-left cursor-pointer w-full"
      >
        {/* Pax badge */}
        <div className="mb-5">
          <span className="text-xs text-brand-gold/70 font-medium bg-brand-gold/5 px-2.5 py-1 rounded-full">
            {pkg.pax} tamu
          </span>
        </div>

        {/* Name */}
        <h3 className="font-serif text-lg text-brand-taupe font-semibold mb-1">
          {pkg.name}
        </h3>

        {/* Price */}
        <p className="text-2xl font-bold text-brand-taupe mt-2 mb-4">
          {formatIDR(pkg.price)}
        </p>

        {/* Content preview — line-clamp + fade */}
        {pkg.content && (
          <div className="relative mb-4">
            <div
              className="prose prose-sm max-w-none line-clamp-3 text-brand-taupe/55 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-taupe/60 [&_h3]:mb-1 [&_h3]:mt-2 [&_ul]:pl-4 [&_ul]:space-y-0.5 [&_ul]:my-1 [&_li]:text-brand-taupe/50 [&_li]:text-xs"
              dangerouslySetInnerHTML={{ __html: pkg.content }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        )}

        {/* CTA */}
        <span className="text-xs font-medium text-brand-gold/70 hover:text-brand-gold mt-auto inline-flex items-center gap-1">
          Lihat Detail
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {/* Modal */}
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FDFBF7] border-brand-sand/40 p-0 gap-0">
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-brand-gold/10 via-brand-gold/5 to-transparent px-6 md:px-8 pt-8 pb-6">
          <span className="text-xs text-brand-gold/70 font-medium bg-brand-gold/10 px-2.5 py-1 rounded-full">
            {pkg.pax} tamu
          </span>
          <DialogTitle className="font-serif text-xl md:text-2xl text-brand-taupe mt-3 mb-1">
            {pkg.name}
          </DialogTitle>
          <p className="text-2xl md:text-3xl font-bold text-brand-taupe">
            {formatIDR(pkg.price)}
          </p>
        </div>

        {/* Content */}
        {pkg.content && (
          <div className="px-6 md:px-8 py-6">
            <div
              className="[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-taupe/75 [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:first:mt-0 [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0 [&_ul]:space-y-2 [&_li]:relative [&_li]:pl-5 [&_li]:text-sm [&_li]:text-brand-taupe/55 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:rounded-full [&_li]:before:bg-brand-gold/40"
              dangerouslySetInnerHTML={{ __html: pkg.content }}
            />
          </div>
        )}

        {/* Footer CTA */}
        <div className="sticky bottom-0 px-6 md:px-8 py-5 bg-white border-t border-brand-sand/40 rounded-b-xl">
          <a
            href={pkg.bookingUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-brand-gold text-white rounded-xl text-sm font-medium text-center hover:bg-brand-taupe transition-colors"
          >
            Konsultasi Gratis
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
