import { createAnnouncementInline } from "@/actions/adminAnnouncementInlineActions";
import InlineAdminAnnouncementForm from "@/components/InlineAdminAnnouncementForm";

const categories = [
  "Tournament",
  "Community",
  "Update",
  "Maintenance",
  "Event",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-bold text-gray-200">{children}</span>;
}

function inputClass() {
  return "rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-400";
}

export default function AdminAnnouncementForm() {
  return (
    <section>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            Announcements
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Create announcement
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            Add a new public announcement. You can publish or mark it as
            important after creating it.
          </p>
        </div>

        <InlineAdminAnnouncementForm
          action={createAnnouncementInline}
          buttonLabel="Create announcement"
          pendingLabel="Creating..."
          resetOnSuccess
          className="grid gap-4"
        >
          <input type="hidden" name="published" value="false" />
          <input type="hidden" name="important" value="false" />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <label className="grid gap-2">
              <FieldLabel>Title</FieldLabel>

              <input
                name="title"
                required
                placeholder="Example: Ascendra Cup registration is open"
                className={inputClass()}
              />
            </label>

            <label className="grid gap-2">
              <FieldLabel>Category</FieldLabel>

              <select
                name="category"
                required
                defaultValue=""
                className={inputClass()}
              >
                <option value="" disabled>
                  Select category
                </option>

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
              placeholder="Write the announcement details..."
              className={`${inputClass()} min-h-24 resize-y`}
            />
          </label>
        </InlineAdminAnnouncementForm>
      </div>
    </section>
  );
}
