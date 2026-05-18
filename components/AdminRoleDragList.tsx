"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  activateRoleInline,
  deactivateRoleInline,
  deleteRoleInline,
  reorderRolesInline,
  updateRoleInline,
  type AdminRoleActionResult,
} from "@/actions/adminRoleInlineActions";
import InlineAdminRoleForm from "@/components/InlineAdminRoleForm";

type RoleItem = {
  id: string;
  name: string;
  color: string;
  description: string;
  order: number;
  isActive: boolean;
};

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black ${
        active
          ? "border-green-500/20 bg-green-500/10 text-green-300"
          : "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function inputClass() {
  return "rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400";
}

function moveItem(items: RoleItem[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);

  if (!movedItem) {
    return items;
  }

  nextItems.splice(toIndex, 0, movedItem);

  return nextItems.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

function normalizeColor(color: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  return "#22d3ee";
}

export default function AdminRoleDragList({
  initialRoles,
}: {
  initialRoles: RoleItem[];
}) {
  const router = useRouter();
  const [roles, setRoles] = useState(initialRoles);
  const [draggedRoleId, setDraggedRoleId] = useState<string | null>(null);
  const [dragOverRoleId, setDragOverRoleId] = useState<string | null>(null);
  const [notice, setNotice] = useState<AdminRoleActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setRoles(initialRoles);
  }, [initialRoles]);

  function saveOrder(nextRoles: RoleItem[]) {
    const formData = new FormData();

    formData.set(
      "orderedRoleIds",
      JSON.stringify(nextRoles.map((role) => role.id)),
    );

    startTransition(async () => {
      const result = await reorderRolesInline(formData);

      setNotice(result);

      if (!result.ok) {
        setRoles(initialRoles);
        return;
      }

      window.setTimeout(() => {
        router.refresh();
      }, 450);
    });
  }

  function handleDragStart(roleId: string) {
    setDraggedRoleId(roleId);
    setNotice(null);
  }

  function handleDragOver(roleId: string) {
    if (!draggedRoleId || draggedRoleId === roleId) {
      return;
    }

    setDragOverRoleId(roleId);
  }

  function handleDrop(targetRoleId: string) {
    if (!draggedRoleId || draggedRoleId === targetRoleId) {
      setDraggedRoleId(null);
      setDragOverRoleId(null);
      return;
    }

    const fromIndex = roles.findIndex((role) => role.id === draggedRoleId);
    const toIndex = roles.findIndex((role) => role.id === targetRoleId);

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedRoleId(null);
      setDragOverRoleId(null);
      return;
    }

    const nextRoles = moveItem(roles, fromIndex, toIndex);

    setRoles(nextRoles);
    setDraggedRoleId(null);
    setDragOverRoleId(null);
    saveOrder(nextRoles);
  }

  function handleDragEnd() {
    setDraggedRoleId(null);
    setDragOverRoleId(null);
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-gray-300">
        No roles found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
        <div>
          <p className="text-sm font-black text-white">Drag to reorder</p>
          <p className="mt-1 text-sm text-gray-400">
            Hold the handle and drop the role in its new position.
          </p>
        </div>

        {notice && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-bold ${
              notice.ok
                ? "border-green-500/20 bg-green-500/10 text-green-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {notice.message}
          </div>
        )}

        {pending && (
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-300">
            Saving order...
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {roles.map((role, index) => {
          const position = index + 1;
          const isDragging = draggedRoleId === role.id;
          const isDragTarget = dragOverRoleId === role.id;

          return (
            <article
              key={role.id}
              draggable
              onDragStart={() => handleDragStart(role.id)}
              onDragOver={(event) => {
                event.preventDefault();
                handleDragOver(role.id);
              }}
              onDrop={() => handleDrop(role.id)}
              onDragEnd={handleDragEnd}
              className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition ${
                isDragging ? "opacity-50" : ""
              } ${isDragTarget ? "bg-cyan-400/10" : "hover:bg-white/[0.06]"}`}
            >
              <div className="grid gap-5 xl:grid-cols-[72px_minmax(0,1fr)_210px] xl:items-start">
                <div className="flex items-center justify-between gap-3 xl:grid xl:gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-black text-cyan-200">
                      {position}
                    </span>

                    <div className="xl:hidden">
                      <p className="text-sm font-black text-white">
                        {role.name}
                      </p>

                      <div className="mt-1">
                        <StatusBadge active={role.isActive} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Drag role"
                    className="grid h-10 w-10 cursor-grab place-items-center rounded-xl border border-white/10 bg-black/20 text-lg font-black text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-200 active:cursor-grabbing"
                  >
                    ≡
                  </button>
                </div>

                <InlineAdminRoleForm
                  action={updateRoleInline}
                  buttonLabel="Save changes"
                  pendingLabel="Saving..."
                  className="grid gap-4"
                >
                  <input type="hidden" name="roleId" value={role.id} />
                  <input type="hidden" name="order" value={position} />

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_170px]">
                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-gray-200">
                        Role name
                      </span>

                      <input
                        name="name"
                        required
                        defaultValue={role.name}
                        className={inputClass()}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-gray-200">
                        Color
                      </span>

                      <input
                        name="color"
                        type="color"
                        required
                        defaultValue={normalizeColor(role.color)}
                        className="h-[50px] w-full cursor-pointer rounded-xl border border-white/10 bg-black/30 p-2 outline-none transition focus:border-cyan-400"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-gray-200">
                      Description
                    </span>

                    <textarea
                      name="description"
                      required
                      defaultValue={role.description}
                      className={`${inputClass()} min-h-20 resize-y text-sm leading-6`}
                    />
                  </label>
                </InlineAdminRoleForm>

                <div className="grid content-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-gray-400">
                      Status
                    </p>

                    <StatusBadge active={role.isActive} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
                    {role.isActive ? (
                      <InlineAdminRoleForm
                        action={deactivateRoleInline}
                        buttonLabel="Hide"
                        pendingLabel="Hiding..."
                        variant="danger"
                        className="grid gap-2"
                      >
                        <input type="hidden" name="roleId" value={role.id} />
                      </InlineAdminRoleForm>
                    ) : (
                      <InlineAdminRoleForm
                        action={activateRoleInline}
                        buttonLabel="Show"
                        pendingLabel="Showing..."
                        variant="success"
                        className="grid gap-2"
                      >
                        <input type="hidden" name="roleId" value={role.id} />
                      </InlineAdminRoleForm>
                    )}

                    <InlineAdminRoleForm
                      action={deleteRoleInline}
                      buttonLabel="Delete"
                      pendingLabel="Deleting..."
                      variant="danger"
                      className="grid gap-2"
                      confirmTitle="Delete role?"
                      confirmDescription={`Are you sure you want to delete ${role.name}? This cannot be undone.`}
                      confirmLabel="Delete permanently"
                    >
                      <input type="hidden" name="roleId" value={role.id} />
                    </InlineAdminRoleForm>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
