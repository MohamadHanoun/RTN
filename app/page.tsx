import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServerStats from "@/components/ServerStats";
import Features from "@/components/Features";
import RulesPreview from "@/components/RulesPreview";
import HomeCTA from "@/components/HomeCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />
      <Hero />
      <ServerStats />
      <Features />
      <RulesPreview />
      <HomeCTA />
      <Footer />
    </main>
  );
}