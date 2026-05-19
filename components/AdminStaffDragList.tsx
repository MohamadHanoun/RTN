"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  activateStaffInline,
  deactivateStaffInline,
  deleteStaffInline,
  reorderStaffInline,
  updateStaffInline,
  type AdminStaffActionResult,
} from "@/actions/adminStaffInlineActions";
import InlineAdminStaffForm from "@/components/InlineAdminStaffForm";

type StaffItem = {
  id: string;
  name: string;
  role: string;
  status: string;
  order: number;
  isActive: boolean;
};

const staffStatuses = [
  { value: "active", label: "Active" },
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "inactive", label: "Inactive" },
];

function StatusBadge({ active, status }: { active: boolean; status: string }) {
  if (!active) {
    return (
      <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-gray-300">
        Hidden
      </span>
    );
  }

  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    active: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    available: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    busy: "border-yellow-400/25 bg-yellow-500/10 text-yellow-300",
    inactive: "border-white/10 bg-white/5 text-gray-300",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black capitalize ${
        styles[normalizedStatus] || "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

function inputClass() {
  return "rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-400";
}

function moveItem(items: StaffItem[], fromIndex: number, toIndex: number) {
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

export default function AdminStaffDragList({
  initialStaffMembers,
}: {
  initialStaffMembers: StaffItem[];
}) {
  const router = useRouter();
  const [staffMembers, setStaffMembers] = useState(initialStaffMembers);
  const [draggedStaffId, setDraggedStaffId] = useState<string | null>(null);
  const [dragOverStaffId, setDragOverStaffId] = useState<string | null>(null);
  const [notice, setNotice] = useState<AdminStaffActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setStaffMembers(initialStaffMembers);
  }, [initialStaffMembers]);

  function saveOrder(nextStaffMembers: StaffItem[]) {
    const formData = new FormData();

    formData.set(
      "orderedStaffIds",
      JSON.stringify(nextStaffMembers.map((staffMember) => staffMember.id)),
    );

    startTransition(async () => {
      const result = await reorderStaffInline(formData);

      setNotice(result);

      if (!result.ok) {
        setStaffMembers(initialStaffMembers);
        return;
      }

      window.setTimeout(() => {
        router.refresh();
      }, 450);
    });
  }

  function handleDragStart(staffId: string) {
    setDraggedStaffId(staffId);
    setNotice(null);
  }

  function handleDragOver(staffId: string) {
    if (!draggedStaffId || draggedStaffId === staffId) {
      return;
    }

    setDragOverStaffId(staffId);
  }

  function handleDrop(targetStaffId: string) {
    if (!draggedStaffId || draggedStaffId === targetStaffId) {
      setDraggedStaffId(null);
      setDragOverStaffId(null);
      return;
    }

    const fromIndex = staffMembers.findIndex(
      (staffMember) => staffMember.id === draggedStaffId,
    );
    const toIndex = staffMembers.findIndex(
      (staffMember) => staffMember.id === targetStaffId,
    );

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedStaffId(null);
      setDragOverStaffId(null);
      return;
    }

    const nextStaffMembers = moveItem(staffMembers, fromIndex, toIndex);

    setStaffMembers(nextStaffMembers);
    setDraggedStaffId(null);
    setDragOverStaffId(null);
    saveOrder(nextStaffMembers);
  }

  function handleDragEnd() {
    setDraggedStaffId(null);
    setDragOverStaffId(null);
  }

  if (staffMembers.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-gray-300 shadow-2xl shadow-black/20">
        No staff members found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm font-black text-white">Drag to reorder</p>
          <p className="mt-1 text-sm text-gray-400">
            Hold the handle and drop the staff member in a new position.
          </p>
        </div>

        {notice && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
              notice.ok
                ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                : "border-red-400/25 bg-red-500/10 text-red-300"
            }`}
          >
            {notice.message}
          </div>
        )}

        {pending && (
          <div className="rounded-2xl border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-sm font-bold text-violet-200">
            Saving order...
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {staffMembers.map((staffMember, index) => {
          const position = index + 1;
          const isDragging = draggedStaffId === staffMember.id;
          const isDragTarget = dragOverStaffId === staffMember.id;

          return (
            <article
              key={staffMember.id}
              draggable
              onDragStart={() => handleDragStart(staffMember.id)}
              onDragOver={(event) => {
                event.preventDefault();
                handleDragOver(staffMember.id);
              }}
              onDrop={() => handleDrop(staffMember.id)}
              onDragEnd={handleDragEnd}
              className={`rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 transition ${
                isDragging ? "opacity-50" : ""
              } ${isDragTarget ? "bg-violet-500/10" : "hover:bg-white/[0.06]"}`}
            >
              <div className="grid gap-5 xl:grid-cols-[72px_minmax(0,1fr)_210px] xl:items-start">
                <div className="flex items-center justify-between gap-3 xl:grid xl:gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-400/25 bg-violet-500/10 text-lg font-black text-violet-200">
                      {position}
                    </span>

                    <div className="xl:hidden">
                      <p className="text-sm font-black text-white">
                        {staffMember.name}
                      </p>

                      <div className="mt-1">
                        <StatusBadge
                          active={staffMember.isActive}
                          status={staffMember.status}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Drag staff member"
                    className="grid h-10 w-10 cursor-grab place-items-center rounded-xl border border-white/10 bg-black/25 text-lg font-black text-gray-300 transition hover:border-violet-400/40 hover:text-violet-200 active:cursor-grabbing"
                  >
                    ≡
                  </button>
                </div>

                <InlineAdminStaffForm
                  action={updateStaffInline}
                  buttonLabel="Save changes"
                  pendingLabel="Saving..."
                  className="grid gap-4"
                >
                  <input type="hidden" name="staffId" value={staffMember.id} />
                  <input type="hidden" name="order" value={position} />

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px]">
                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-gray-200">
                        Name
                      </span>

                      <input
                        name="name"
                        required
                        defaultValue={staffMember.name}
                        className={inputClass()}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-gray-200">
                        Role
                      </span>

                      <input
                        name="role"
                        required
                        defaultValue={staffMember.role}
                        className={inputClass()}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-gray-200">
                        Status
                      </span>

                      <select
                        name="status"
                        required
                        defaultValue={staffMember.status}
                        className={inputClass()}
                      >
                        {staffStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </InlineAdminStaffForm>

                <div className="grid content-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                      Visibility
                    </p>

                    <StatusBadge
                      active={staffMember.isActive}
                      status={staffMember.status}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
                    {staffMember.isActive ? (
                      <InlineAdminStaffForm
                        action={deactivateStaffInline}
                        buttonLabel="Hide"
                        pendingLabel="Hiding..."
                        variant="danger"
                        className="grid gap-2"
                      >
                        <input
                          type="hidden"
                          name="staffId"
                          value={staffMember.id}
                        />
                      </InlineAdminStaffForm>
                    ) : (
                      <InlineAdminStaffForm
                        action={activateStaffInline}
                        buttonLabel="Show"
                        pendingLabel="Showing..."
                        variant="success"
                        className="grid gap-2"
                      >
                        <input
                          type="hidden"
                          name="staffId"
                          value={staffMember.id}
                        />
                      </InlineAdminStaffForm>
                    )}

                    <InlineAdminStaffForm
                      action={deleteStaffInline}
                      buttonLabel="Delete"
                      pendingLabel="Deleting..."
                      variant="danger"
                      className="grid gap-2"
                      confirmTitle="Delete staff member?"
                      confirmDescription={`Are you sure you want to delete ${staffMember.name}? This cannot be undone.`}
                      confirmLabel="Delete permanently"
                    >
                      <input
                        type="hidden"
                        name="staffId"
                        value={staffMember.id}
                      />
                    </InlineAdminStaffForm>
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
