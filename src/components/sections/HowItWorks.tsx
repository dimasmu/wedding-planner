import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Vendor",
    description: "Browse our curated marketplace of trusted wedding professionals. Filter by category, location, and budget.",
    step: "01",
  },
  {
    icon: Heart,
    title: "Book With Confidence",
    description: "Request quotes, compare packages, and book vendors directly. Transparent pricing, no hidden fees.",
    step: "02",
  },
  {
    icon: ClipboardCheck,
    title: "Plan Seamlessly",
    description: "Track your checklist, manage your guest list, and monitor your budget — all from your dashboard.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            How It Works
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Three simple steps from dreaming to saying &ldquo;I do.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map(({ icon: Icon, title, description, step }) => (
            <Card
              key={step}
              className="bg-white border-brand-sand shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <CardContent className="p-8 text-center">
                <span className="font-serif text-5xl text-brand-gold/20 font-bold block mb-6 group-hover:text-brand-gold/30 transition-colors">
                  {step}
                </span>
                <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-serif text-xl text-brand-taupe mb-3">{title}</h3>
                <p className="text-brand-taupe/60 text-sm leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
