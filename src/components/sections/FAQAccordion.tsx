import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/data/faq";

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
