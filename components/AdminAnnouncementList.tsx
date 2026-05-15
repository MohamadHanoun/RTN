import {
  deleteAnnouncement,
  updateAnnouncement,
} from "@/actions/announcementActions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import { prisma } from "@/lib/prisma";

async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
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
            Edit, publish, highlight, or delete announcements from the database.
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-gray-300">
            No announcements found yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <form action={updateAnnouncement} className="grid gap-4">
                  <input type="hidden" name="id" value={announcement.id} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">Title</span>
                      <input
                        name="title"
                        defaultValue={announcement.title}
                        required
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">
                        Category
                      </span>
                      <select
                        name="category"
                        defaultValue={announcement.category}
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                      >
                        <option value="Update">Update</option>
                        <option value="Tournaments">Tournaments</option>
                        <option value="Bot">Bot</option>
                        <option value="Community">Community</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="font-semibold text-gray-200">
                      Description
                    </span>
                    <textarea
                      name="description"
                      defaultValue={announcement.description}
                      required
                      rows={4}
                      className="resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                    />
                  </label>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-gray-300">
                      <input
                        name="important"
                        type="checkbox"
                        defaultChecked={announcement.important}
                      />
                      Important
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-gray-300">
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={announcement.published}
                      />
                      Published
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-xl border border-indigo-500/20 px-4 py-2 font-bold text-indigo-300 transition hover:bg-indigo-500/10"
                    >
                      Save Changes
                    </button>

                    <ConfirmDeleteForm
                      id={announcement.id}
                      action={deleteAnnouncement}
                      message="Are you sure you want to delete this announcement?"
                    />
                  </div>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}