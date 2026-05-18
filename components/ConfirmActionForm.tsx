"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type HiddenField = {
  name: string;
  value: string;
};

type ConfirmActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields: HiddenField[];
  buttonLabel: string;
  pendingLabel?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "secondary";
};

function SubmitButton({
  pendingLabel,
  confirmLabel,
  variant,
}: {
  pendingLabel?: string;
  confirmLabel: string;
  variant: "danger" | "secondary";
}) {
  const { pending } = useFormStatus();

  const classes =
    variant === "danger"
      ? "rounded bg-red-500 px-5 py-3 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
      : "rounded bg-indigo-500 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button type="submit" disabled={pending} className={classes}>
      {pending ? pendingLabel || "Working..." : confirmLabel}
    </button>
  );
}

export default function ConfirmActionForm({
  action,
  hiddenFields,
  buttonLabel,
  pendingLabel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmActionFormProps) {
  const [open, setOpen] = useState(false);

  const buttonClasses =
    variant === "danger"
      ? "rounded border border-red-500/25 px-4 py-2 text-sm font-black text-red-300 transition hover:bg-red-500/10"
      : "rounded border border-white/10 px-4 py-2 text-sm font-black text-gray-300 transition hover:bg-white/10 hover:text-white";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses}
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/40">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-cyan-300">
                Confirmation
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>

              <p className="mt-2 leading-7 text-gray-300">{description}</p>
            </div>

            <form
              action={action}
              className="flex flex-wrap justify-end gap-3 p-6"
            >
              {hiddenFields.map((field) => (
                <input
                  key={`${field.name}-${field.value}`}
                  type="hidden"
                  name={field.name}
                  value={field.value}
                />
              ))}

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-white/10 px-5 py-3 text-sm font-black text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                {cancelLabel}
              </button>

              <SubmitButton
                pendingLabel={pendingLabel}
                confirmLabel={confirmLabel}
                variant={variant}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
