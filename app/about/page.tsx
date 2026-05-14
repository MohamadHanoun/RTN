import AboutCard from "@/components/AboutCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { aboutItems } from "@/data/about";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="About RTN"
        title="The Noobs of Temple & Rift community."
        description="RTN is a gaming, tournament, and community-focused Discord server built for players who want a modern and organized place to connect."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-2">
        {aboutItems.map((item) => (
          <AboutCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}