import type { Metadata } from "next";
import AnnouncementCard from "@/components/AnnouncementCard";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "News | Ascendra",
  description:
    "Read the latest Ascendra community announcements, updates, and event news.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getAnnouncements() {
  const announcements = await prisma.announcement.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        important: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    category: announcement.category,
    description: announcement.description,
    important: announcement.important,
    createdAt: announcement.createdAt.toISOString(),
  }));
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-white">{value}</p>
    </div>
  );
}

function SectionTitle({
  label,
  color = "violet",
}: {
  label: string;
  color?: "violet" | "yellow";
}) {
  return (
    <div className="mb-4">
      <p
        className={`text-sm font-black uppercase tracking-[0.18em] ${
          color === "yellow" ? "text-yellow-300" : "text-violet-300"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  const importantAnnouncements = announcements.filter(
    (announcement) => announcement.important,
  );

  const featuredAnnouncement = importantAnnouncements[0];

  const regularAnnouncements = featuredAnnouncement
    ? announcements.filter(
        (announcement) => announcement.id !== featuredAnnouncement.id,
      )
    : announcements;

  const categoriesCount = new Set(
    announcements.map((announcement) => announcement.category),
  ).size;

  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18)_0%,transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#0b0d17_45%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,8,17,0.98),rgba(7,8,17,0.82),rgba(7,8,17,0.98)),url('https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.28)_0%,transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10)_0%,transparent_28%)]" />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 lg:px-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-violet-300">
              Ascendra news
            </p>

            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl">
              Community news and updates.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Read the latest Ascendra announcements, tournament news, server
              updates, and community events.
            </p>
          </div>

          <svg
            className="absolute bottom-[-1px] left-0 w-full text-[#070811]"
            viewBox="0 0 1440 120"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 lg:px-10">
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="Published" value={announcements.length} />
            <StatCard label="Important" value={importantAnnouncements.length} />
            <StatCard label="Categories" value={categoriesCount} />
          </section>

          {announcements.length === 0 ? (
            <EmptyState
              title="No announcements yet"
              description="Published Ascendra announcements will appear here when new updates are available."
            />
          ) : (
            <div className="grid gap-12">
              {featuredAnnouncement && (
                <section>
                  <SectionTitle label="Featured announcement" color="yellow" />

                  <AnnouncementCard
                    announcement={featuredAnnouncement}
                    featured
                  />
                </section>
              )}

              {regularAnnouncements.length > 0 && (
                <section>
                  <SectionTitle label="Latest updates" />

                  <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {regularAnnouncements.map((announcement) => (
                      <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
