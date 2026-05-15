import {
  deleteAnnouncement,
  toggleAnnouncementImportant,
  toggleAnnouncementPublished,
} from "@/actions/announcementActions";
import { prisma } from "@/lib/prisma";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
  });
}

export default async function AdminAnnouncementList() {
  const announcements = await getAnnouncements();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-8">
          <h2 className="mb-3 text-3xl font-black">Manage Announcements</h2>
          <p className="max-w-2xl leading-7 text-gray-300">
            Review, publish, hide, highlight, or delete recent announcements
            from the RTN database.
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-gray-300">
            No announcements found yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-semibold text-indigo-300">
                        {announcement.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          announcement.published
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {announcement.published ? "Published" : "Hidden"}
                      </span>

                      {announcement.important && (
                        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-semibold text-yellow-300">
                          Important
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold">
                      {announcement.title}
                    </h3>

                    <p className="mt-2 max-w-3xl leading-7 text-gray-300">
                      {announcement.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <form action={toggleAnnouncementPublished}>
                    <input type="hidden" name="id" value={announcement.id} />
                    <input
                      type="hidden"
                      name="published"
                      value={String(announcement.published)}
                    />

                    <button
                      type="submit"
                      className="rounded-xl border border-white/10 px-4 py-2 font-bold text-gray-200 transition hover:bg-white/10"
                    >
                      {announcement.published ? "Hide" : "Publish"}
                    </button>
                  </form>

                  <form action={toggleAnnouncementImportant}>
                    <input type="hidden" name="id" value={announcement.id} />
                    <input
                      type="hidden"
                      name="important"
                      value={String(announcement.important)}
                    />

                    <button
                      type="submit"
                      className="rounded-xl border border-yellow-500/20 px-4 py-2 font-bold text-yellow-300 transition hover:bg-yellow-500/10"
                    >
                      {announcement.important
                        ? "Remove Important"
                        : "Mark Important"}
                    </button>
                  </form>

                  <ConfirmDeleteForm
                    id={announcement.id}
                    action={deleteAnnouncement}
                    message="Are you sure you want to delete this announcement?"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}