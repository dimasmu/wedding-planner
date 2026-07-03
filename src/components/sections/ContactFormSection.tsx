"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactFormSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    setStatus("loading");
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  const handleReset = () => {
    setStatus("idle");
    reset();
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-gold/10 flex flex-col items-center justify-center text-center min-h-[400px]">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="font-serif text-2xl text-brand-taupe mb-2">
          Terima kasih!
        </h3>
        <p className="text-brand-taupe/60 mb-6">
          Pesan Anda sudah kami terima. Tim kami akan menghubungi Anda dalam
          1x24 jam.
        </p>
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-brand-gold/30 text-brand-taupe hover:bg-brand-gold/5"
        >
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-gold/10">
      <h3 className="font-serif text-2xl text-brand-taupe mb-6">
        Send Us a Message
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-brand-taupe">
            Nama <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nama lengkap Anda"
            {...register("name")}
            className={cn(
              "mt-1.5 bg-brand-cream border-brand-sand text-brand-taupe placeholder:text-brand-taupe/40",
              errors.name && "border-red-400 focus-visible:ring-red-400"
            )}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-brand-taupe">
            Email <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@anda.com"
            {...register("email")}
            className={cn(
              "mt-1.5 bg-brand-cream border-brand-sand text-brand-taupe placeholder:text-brand-taupe/40",
              errors.email && "border-red-400 focus-visible:ring-red-400"
            )}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message" className="text-brand-taupe">
            Pesan <span className="text-red-400">*</span>
          </Label>
          <textarea
            id="message"
            rows={5}
            placeholder="Ceritakan tentang acara yang ingin Anda rencanakan..."
            {...register("message")}
            className={cn(
              "mt-1.5 flex w-full rounded-md border bg-brand-cream px-3 py-2 text-sm text-brand-taupe placeholder:text-brand-taupe/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              errors.message
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-brand-sand focus-visible:ring-brand-gold/30"
            )}
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 py-6 text-base rounded-md"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mengirim...
            </>
          ) : (
            "Kirim Pesan"
          )}
        </Button>
      </form>
    </div>
  );
}
