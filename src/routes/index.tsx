import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '@/shared/components/navbar/Navbar';
import { HeroSection } from '@/shared/components/landing/HeroSection';
import { HowItWorks } from '@/shared/components/landing/HowItWorks';
import { Features } from '@/shared/components/landing/Features';
import { Footer } from '@/shared/components/landing/Footer';

export const Route = createFileRoute('/')({ component: LandingPage });

export function LandingPage() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow mt-16">
          <HeroSection />
          <HowItWorks />
          <Features />
        </main>
        <Footer />
      </div>
    </>
  );
}
