import AnnouncementCard from "@/components/AnnouncementCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { announcements } from "@/data/announcements";

export default function AnnouncementsPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Announcements"
        title="News, updates, and community announcements."
        description="This page will later be managed from the admin panel and used for tournament news, server updates,     and community events."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}