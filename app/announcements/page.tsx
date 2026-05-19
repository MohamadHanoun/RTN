import type { Metadata } from "next";
import AnnouncementCard from "@/components/AnnouncementCard";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "News | Ascendra",
  description: "Ascendra announcements and updates.",
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 shadow-2xl shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16)_0%,transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#0b0d17_45%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1680px] px-6 py-14 lg:px-10 2xl:px-14">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-violet-300">
              Ascendra updates
            </p>

            <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-6xl">
              News
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
              Announcements, tournament updates, and community notices.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-8 px-6 py-10 lg:px-10 2xl:px-14">
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="Published" value={announcements.length} />
            <StatCard label="Important" value={importantAnnouncements.length} />
            <StatCard label="Categories" value={categoriesCount} />
          </section>

          {announcements.length === 0 ? (
            <EmptyState
              title="No announcements yet"
              description="Published announcements will appear here."
            />
          ) : (
            <div className="grid gap-10">
              {featuredAnnouncement && (
                <section>
                  <SectionTitle label="Featured" color="yellow" />

                  <AnnouncementCard
                    announcement={featuredAnnouncement}
                    featured
                  />
                </section>
              )}

              {regularAnnouncements.length > 0 && (
                <section>
                  <SectionTitle label="Latest" />

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
