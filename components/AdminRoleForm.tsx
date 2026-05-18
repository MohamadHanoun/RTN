import { createRoleInline } from "@/actions/adminRoleInlineActions";
import InlineAdminRoleForm from "@/components/InlineAdminRoleForm";

function inputClass() {
  return "rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400";
}

export default function AdminRoleForm() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
            Roles
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">Create role</h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            Add a new community role. It will be placed at the end of the roles
            list automatically.
          </p>
        </div>

        <InlineAdminRoleForm
          action={createRoleInline}
          buttonLabel="Create role"
          pendingLabel="Creating..."
          resetOnSuccess
          className="grid gap-4"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-gray-200">Role name</span>

              <input
                name="name"
                required
                placeholder="Example: Tournament Admin"
                className={inputClass()}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-gray-200">Color</span>

              <input
                name="color"
                type="color"
                required
                defaultValue="#22d3ee"
                className="h-[50px] w-full cursor-pointer rounded-xl border border-white/10 bg-black/30 p-2 outline-none transition focus:border-cyan-400"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-gray-200">Description</span>

            <textarea
              name="description"
              required
              placeholder="Describe what this role means..."
              className={`${inputClass()} min-h-24 resize-y`}
            />
          </label>
        </InlineAdminRoleForm>
      </div>
    </section>
  );
}
