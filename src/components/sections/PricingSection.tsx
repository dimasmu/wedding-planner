import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Start planning your wedding at no cost.",
    features: [
      "Browse vendor marketplace",
      "Basic wedding checklist (10 tasks)",
      "Guest list tracker (up to 50 guests)",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$12",
    period: "/month",
    description: "Everything you need for a seamless planning experience.",
    features: [
      "Everything in Free",
      "Unlimited checklist tasks",
      "Budget tracker with charts",
      "Guest list (unlimited guests)",
      "RSVP management",
      "Priority vendor support",
    ],
    cta: "Start Premium",
    href: "/register?plan=premium",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Partner",
    price: "Custom",
    description: "For wedding planners and agencies managing multiple events.",
    features: [
      "Everything in Premium",
      "Multi-event management",
      "White-label client dashboard",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-brand-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Choose the plan that fits your wedding planning needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative border-brand-sand shadow-sm ${
                tier.highlighted
                  ? "border-brand-gold ring-2 ring-brand-gold/20 shadow-lg scale-[1.02]"
                  : ""
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-white px-4">
                  {tier.badge}
                </Badge>
              )}
              <CardHeader className="text-center pb-0">
                <CardTitle className="font-serif text-xl text-brand-taupe">{tier.name}</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="font-serif text-4xl text-brand-taupe">{tier.price}</span>
                  {tier.period && (
                    <span className="text-brand-taupe/50 text-sm">{tier.period}</span>
                  )}
                </div>
                <CardDescription className="text-brand-taupe/60">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                      <span className="text-sm text-brand-taupe/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.href}>
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-brand-gold text-white hover:bg-brand-taupe"
                        : "bg-white border border-brand-gold text-brand-gold hover:bg-brand-gold/5"
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
