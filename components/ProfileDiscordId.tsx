"use client";

import { useState } from "react";

type ProfileDiscordIdProps = {
  discordId: string;
};

export default function ProfileDiscordId({ discordId }: ProfileDiscordIdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const hiddenId =
    discordId.length > 6 ? `${discordId.slice(0, 6)}******` : "******";

  async function copyDiscordId() {
    await navigator.clipboard.writeText(discordId);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Discord ID
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <code className="min-w-0 rounded-xl bg-black/30 px-3 py-2 text-sm text-gray-300">
          {isVisible ? discordId : hiddenId}
        </code>

        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
          title={isVisible ? "Hide Discord ID" : "Show Discord ID"}
        >
          {isVisible ? "Hide" : "Show"}
        </button>

        <button
          type="button"
          onClick={copyDiscordId}
          className="rounded-xl border border-indigo-500/20 px-3 py-2 text-sm font-bold text-indigo-300 transition hover:bg-indigo-500/10"
          title="Copy Discord ID"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
