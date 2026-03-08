import CTA from "@/components/CTA";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Particles from "@/components/Particles";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <Particles />
      <div className="relative z-10 space-y-24 pb-24">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </div>
    </main>
  );
}
