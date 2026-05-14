import Footer from "@/components/Footer";
import LeaderboardTable from "@/components/LeaderboardTable";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import XpSystemPreview from "@/components/XpSystemPreview";
import { leaderboardUsers } from "@/data/leaderboard";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Leaderboard"
        title="Levels, XP, and the most active players."
        description="This page is prepared for the future RTN XP system, Discord bot, database, and live community      ranking."
     />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <LeaderboardTable users={leaderboardUsers} />
      </section>

      <XpSystemPreview />

      <Footer />
    </main>
  );
}