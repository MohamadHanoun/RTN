import AnnouncementCard from "@/components/AnnouncementCard";
import AnnouncementSummary from "@/components/AnnouncementSummary";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getAnnouncements() {
  return prisma.announcement.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Announcements"
        title="News, updates, and community announcements."
        description="This page is connected to the database and prepared for tournament news, server updates, feature releases, and community events."
      />

      <AnnouncementSummary announcements={announcements} />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-indigo-300">
            Announcement System Coming Later
          </h2>

          <p className="leading-7 text-gray-300">
            Announcements are now loaded from the database. Later, RTN admins
            will be able to create, publish, edit, and highlight announcements
            directly from the admin panel.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}