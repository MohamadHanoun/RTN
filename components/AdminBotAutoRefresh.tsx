"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type AdminBotAutoRefreshProps = {
  intervalSeconds?: number;
};

export default function AdminBotAutoRefresh({
  intervalSeconds = 30,
}: AdminBotAutoRefreshProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [lastRefreshAt, setLastRefreshAt] = useState<Date | null>(null);

  function refreshBotPanel() {
    startTransition(() => {
      router.refresh();
      setLastRefreshAt(new Date());
    });
  }

  useEffect(() => {
    const intervalMs = intervalSeconds * 1000;

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      refreshBotPanel();
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [intervalSeconds]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
          Live status
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-300">
          Updates every {intervalSeconds} seconds while this tab is open.
        </p>

        {lastRefreshAt && (
          <p className="mt-1 text-xs text-gray-500">
            Last refresh: {lastRefreshAt.toLocaleTimeString()}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={refreshBotPanel}
        disabled={isPending}
        className="rounded-xl border border-violet-400/35 bg-violet-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-violet-100 transition hover:border-violet-300 hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Refreshing..." : "Refresh now"}
      </button>
    </div>
  );
}
