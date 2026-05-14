import TournamentHero from "@/components/TournamentHero";
import TournamentCard from "@/components/TournamentCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { tournaments } from "@/data/tournaments";

export default function TournamentsPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />
      <TournamentHero />

      <section id="tournaments" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10">
          <h2 className="text-4xl font-black">Available Tournaments</h2>
          <p className="mt-4 max-w-2xl text-gray-300">
            Here you will later find active tournaments, registration forms,
            team slots, match schedules, and tournament results.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}