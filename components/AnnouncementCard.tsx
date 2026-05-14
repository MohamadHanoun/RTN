import type { Announcement } from "@/data/announcements";

type AnnouncementCardProps = {
  announcement: Announcement;
};

export default function AnnouncementCard({
  announcement,
}: AnnouncementCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-indigo-500/20 px-4 py-1 text-sm font-semibold text-indigo-300">
          {announcement.category}
        </span>

        {announcement.important && (
          <span className="rounded-full bg-yellow-500/20 px-4 py-1 text-sm font-semibold text-yellow-300">
            Important
          </span>
        )}
      </div>

      <h2 className="mb-3 text-2xl font-bold">{announcement.title}</h2>

      <p className="mb-5 text-sm text-gray-400">{announcement.date}</p>

      <p className="leading-7 text-gray-300">{announcement.description}</p>
    </article>
  );
}