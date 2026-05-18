"use client";

import { useState } from "react";

type ProfileIdentityActionsProps = {
  discordId: string;
};

export default function ProfileIdentityActions({
  discordId,
}: ProfileIdentityActionsProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const hiddenDiscordId =
    discordId.length > 8
      ? `${discordId.slice(0, 5)}******${discordId.slice(-3)}`
      : "Hidden";

  async function copyDiscordId() {
    try {
      await navigator.clipboard.writeText(discordId);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="rounded border border-white/10 bg-black/25 px-3 py-2 text-sm font-bold text-white">
        {visible ? discordId : hiddenDiscordId}
      </code>

      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="rounded border border-white/10 px-3 py-2 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        {visible ? "Hide" : "Show"}
      </button>

      <button
        type="button"
        onClick={copyDiscordId}
        className="rounded border border-indigo-500/30 px-3 py-2 text-sm font-bold text-indigo-300 transition hover:bg-indigo-500/10"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
