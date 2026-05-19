import {
  deleteAnnouncementInline,
  markAnnouncementImportantInline,
  publishAnnouncementInline,
  unmarkAnnouncementImportantInline,
  unpublishAnnouncementInline,
  updateAnnouncementInline,
} from "@/actions/adminAnnouncementInlineActions";
import InlineAdminAnnouncementForm from "@/components/InlineAdminAnnouncementForm";
import { prisma } from "@/lib/prisma";

const categories = [
  "Tournament",
  "Community",
  "Update",
  "Maintenance",
  "Event",
];

type AnnouncementAction = (formData: FormData) => Promise<{
  ok: boolean;
  message: string;
  redirectTo?: string;
}>;

function inputClass() {
  return "rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-400";
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-bold text-gray-200">{children}</span>;
}

function StatusBadge({
  published,
  important,
}: {
  published: boolean;
  important: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black ${
          published
            ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
            : "border-white/10 bg-white/5 text-gray-300"
        }`}
      >
        {published ? "Published" : "Hidden"}
      </span>

      {important && (
        <span className="inline-flex w-fit rounded-full border border-yellow-400/25 bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-300">
          Important
        </span>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function SmallAction({
  action,
  announcementId,
  label,
  pendingLabel,
  variant = "secondary",
}: {
  action: AnnouncementAction;
  announcementId: string;
  label: string;
  pendingLabel: string;
  variant?: "primary" | "success" | "danger" | "secondary";
}) {
  return (
    <InlineAdminAnnouncementForm
      action={action}
      buttonLabel={label}
      pendingLabel={pendingLabel}
      variant={variant}
      className="grid gap-2"
    >
      <input type="hidden" name="announcementId" value={announcementId} />
    </InlineAdminAnnouncementForm>
  );
}

function formatDate(date: Date) {
  return date.toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminAnnouncementList() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [
      {
        published: "desc",
      },
      {
        important: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const publishedCount = announcements.filter(
    (announcement) => announcement.published,
  ).length;

  const hiddenCount = announcements.length - publishedCount;

  const importantCount = announcements.filter(
    (announcement) => announcement.important,
  ).length;

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            Manage announcements
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Announcements list
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Edit announcements, publish or hide them, mark important items, and
            delete announcements with confirmation.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total" value={announcements.length} />
          <StatCard label="Published" value={publishedCount} />
          <StatCard label="Hidden" value={hiddenCount} />
          <StatCard label="Important" value={importantCount} />
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-gray-300 shadow-2xl shadow-black/20">
          No announcements found.
        </div>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
          <div className="hidden border-b border-white/10 bg-black/25 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-500 xl:grid xl:grid-cols-[minmax(0,1fr)_170px_150px_160px_130px] xl:gap-5">
            <span>Announcement</span>
            <span>Category</span>
            <span>Status</span>
            <span>Created</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-white/10">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="grid gap-4 p-5 transition hover:bg-white/[0.035]"
              >
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_170px_150px_160px_130px] xl:items-center xl:gap-5">
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-black text-white">
                      {announcement.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-400">
                      {announcement.description}
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs font-black text-violet-200">
                    {announcement.category}
                  </span>

                  <StatusBadge
                    published={announcement.published}
                    important={announcement.important}
                  />

                  <p className="text-sm text-gray-400">
                    {formatDate(announcement.createdAt)}
                  </p>

                  <details className="group">
                    <summary className="cursor-pointer list-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-center text-sm font-black text-gray-300 transition hover:bg-white/10 hover:text-white">
                      Manage
                    </summary>
                  </details>
                </div>

                <details className="rounded-2xl border border-white/10 bg-black/25">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-black text-gray-300 transition hover:text-white">
                    Edit and actions
                  </summary>

                  <div className="grid gap-5 border-t border-white/10 p-4 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
                    <InlineAdminAnnouncementForm
                      action={updateAnnouncementInline}
                      buttonLabel="Save changes"
                      pendingLabel="Saving..."
                      className="grid gap-4"
                    >
                      <input
                        type="hidden"
                        name="announcementId"
                        value={announcement.id}
                      />
                      <input
                        type="hidden"
                        name="published"
                        value={announcement.published ? "true" : "false"}
                      />
                      <input
                        type="hidden"
                        name="important"
                        value={announcement.important ? "true" : "false"}
                      />

                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                        <label className="grid gap-2">
                          <FieldLabel>Title</FieldLabel>

                          <input
                            name="title"
                            required
                            defaultValue={announcement.title}
                            className={inputClass()}
                          />
                        </label>

                        <label className="grid gap-2">
                          <FieldLabel>Category</FieldLabel>

                          <select
                            name="category"
                            required
                            defaultValue={announcement.category}
                            className={inputClass()}
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label className="grid gap-2">
                        <FieldLabel>Description</FieldLabel>

                        <textarea
                          name="description"
                          required
                          defaultValue={announcement.description}
                          className={`${inputClass()} min-h-24 resize-y text-sm leading-6`}
                        />
                      </label>
                    </InlineAdminAnnouncementForm>

                    <aside className="grid content-start gap-4">
                      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                          Visibility
                        </p>

                        <div className="mt-3 grid gap-2">
                          {announcement.published ? (
                            <SmallAction
                              action={unpublishAnnouncementInline}
                              announcementId={announcement.id}
                              label="Unpublish"
                              pendingLabel="Unpublishing..."
                              variant="danger"
                            />
                          ) : (
                            <SmallAction
                              action={publishAnnouncementInline}
                              announcementId={announcement.id}
                              label="Publish"
                              pendingLabel="Publishing..."
                              variant="success"
                            />
                          )}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                          Importance
                        </p>

                        <div className="mt-3 grid gap-2">
                          {announcement.important ? (
                            <SmallAction
                              action={unmarkAnnouncementImportantInline}
                              announcementId={announcement.id}
                              label="Remove important"
                              pendingLabel="Updating..."
                            />
                          ) : (
                            <SmallAction
                              action={markAnnouncementImportantInline}
                              announcementId={announcement.id}
                              label="Mark important"
                              pendingLabel="Updating..."
                              variant="success"
                            />
                          )}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-red-300">
                          Danger zone
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          Delete this announcement permanently.
                        </p>

                        <div className="mt-3">
                          <InlineAdminAnnouncementForm
                            action={deleteAnnouncementInline}
                            buttonLabel="Delete announcement"
                            pendingLabel="Deleting..."
                            variant="danger"
                            className="grid gap-2"
                            confirmTitle="Delete announcement?"
                            confirmDescription={`Are you sure you want to delete ${announcement.title}? This cannot be undone.`}
                            confirmLabel="Delete permanently"
                          >
                            <input
                              type="hidden"
                              name="announcementId"
                              value={announcement.id}
                            />
                          </InlineAdminAnnouncementForm>
                        </div>
                      </section>
                    </aside>
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
