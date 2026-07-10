"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  venueName: string;
}

export function ImageGallery({ images, venueName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const featured = images[0];
  const thumbnails = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
        {/* Featured image */}
        <button
          type="button"
          className="md:col-span-2 relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-2xl md:rounded-none md:rounded-l-2xl"
          onClick={() => setSelectedIndex(0)}
        >
          <Image
            src={featured}
            alt={venueName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* Thumbnails grid */}
        <div className="grid grid-cols-2 gap-3">
          {thumbnails.map((img, i) => (
            <button
              key={i}
              type="button"
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-2xl md:rounded-none"
              onClick={() => setSelectedIndex(i + 1)}
            >
              <Image
                src={img}
                alt={`${venueName} ${i + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {remaining > 0 && i === thumbnails.length - 1 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-sm font-medium flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    +{remaining} Foto
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Dialog open onOpenChange={() => setSelectedIndex(null)}>
          <DialogContent className="sm:max-w-4xl p-1 bg-black/95 border-0" showCloseButton={true}>
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={images[selectedIndex]}
                alt={`${venueName} ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <p className="text-center text-white/70 text-xs px-2 pb-1">
              {selectedIndex + 1} / {images.length}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
