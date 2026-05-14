import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import StatsDetailCard from "@/components/StatsDetailCard";
import { serverStats } from "@/data/stats";
import { statDetails } from "@/data/statDetails";

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Stats"
        title="Real community statistics will live here."
        description="For now, these numbers are placeholders. Later, this page will show live Discord stats collected from the RTN bot and database."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {serverStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
          >
            <p className="text-5xl font-black text-indigo-400">
              {stat.value}
            </p>
            <p className="mt-3 text-gray-300">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-cyan-300">
            Live Stats Coming Later
          </h2>

          <p className="leading-7 text-gray-300">
            This page is prepared for real Discord statistics. Later, the RTN
            bot will collect activity data and the website will display live
            information from the database.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statDetails.map((item) => (
            <StatsDetailCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}