import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "q1",
    question: "Berapa lama persiapan sebelum acara?",
    answer:
      "Kami merekomendasikan booking minimal 3-6 bulan sebelum hari H untuk memastikan semua detail tertata dengan sempurna. Timeline bisa lebih fleksibel tergantung skala acara Anda.",
  },
  {
    id: "q2",
    question: "Apakah bisa request custom dekorasi?",
    answer:
      "Tentu! Setiap dekorasi kami desain khusus sesuai tema dan keinginan Anda. Tidak ada paket yang benar-benar sama — visi Anda adalah prioritas kami.",
  },
  {
    id: "q3",
    question: "Bagaimana cara booking?",
    answer:
      "Hubungi kami via WhatsApp atau isi form di halaman ini. Tim kami akan merespons dalam 1x24 jam untuk konsultasi awal gratis.",
  },
  {
    id: "q4",
    question: "Apakah bisa mengunjungi kantor?",
    answer:
      "Bisa! Kantor kami buka Senin-Jumat pukul 09.00-17.00 WIB. Sebaiknya buat janji dulu via WhatsApp agar tim kami siap menyambut Anda.",
  },
  {
    id: "q5",
    question: "Berapa biaya paket wedding?",
    answer:
      "Setiap pernikahan unik, jadi biaya disesuaikan dengan kebutuhan dan skala acara Anda. Konsultasi awal gratis — kami akan bantu susun estimasi yang sesuai budget Anda tanpa tekanan.",
  },
];

function SectionOrnament() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="h-px w-8 bg-brand-gold/40" />
      <HelpCircle className="w-4 h-4 text-brand-gold" />
      <div className="h-px w-8 bg-brand-gold/40" />
    </div>
  );
}

export function FAQAccordion() {
  return (
    <section className="py-28 bg-brand-cream">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <SectionOrnament />
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-taupe/60 max-w-md mx-auto">
            Ada pertanyaan? Kami punya jawabannya
          </p>
        </div>

        <Accordion className="space-y-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              id={faq.id}
              className="bg-white rounded-xl border border-brand-sand/50 shadow-sm overflow-hidden not-last:border-b not-last:border-brand-sand/50"
            >
              <AccordionTrigger className="px-6 py-5 font-serif text-base md:text-lg text-brand-taupe text-left hover:no-underline hover:bg-brand-sand/30 transition-colors duration-200 data-[slot=accordion-trigger-icon]:text-brand-gold data-[slot=accordion-trigger-icon]:size-5 cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 pb-5 text-brand-taupe/70 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
