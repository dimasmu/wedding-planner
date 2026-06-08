import { HeroSection } from "@/components/sections/HeroSection";
import { AboutUs } from "@/components/sections/AboutUs";
import { ClientPartnerShowcase } from "@/components/sections/ClientPartnerShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { VendorCarousel } from "@/components/sections/VendorCarousel";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { PricingSection } from "@/components/sections/PricingSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <ClientPartnerShowcase />
      <HowItWorks />
      <VendorCarousel />
      <TestimonialCarousel />
      <PricingSection />
    </>
  );
}
