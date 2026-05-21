"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";

export default function AdminBotAutoRefresh() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [lastRefreshAt, setLastRefreshAt] = useState<Date | null>(null);
  const [lastEventCount, setLastEventCount] = useState(0);

  function refreshBotPanel(eventCount = 0) {
    startTransition(() => {
      router.refresh();
      setLastRefreshAt(new Date());

      if (eventCount > 0) {
        setLastEventCount(eventCount);
      }
    });
  }

  useRealtimeEvents({
    audience: "admin",
    intervalSeconds: 10,
    onEvents(events) {
      refreshBotPanel(events.length);
    },
  });

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
          Realtime status
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-300">
          Updates when bot events or heartbeat changes are detected.
        </p>

        {lastRefreshAt && (
          <p className="mt-1 text-xs text-gray-500">
            Last update: {lastRefreshAt.toLocaleTimeString()}
            {lastEventCount > 0 ? ` · ${lastEventCount} event(s)` : ""}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => refreshBotPanel()}
        disabled={isPending}
        className="rounded-xl border border-violet-400/35 bg-violet-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-violet-100 transition hover:border-violet-300 hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Refreshing..." : "Refresh now"}
      </button>
    </div>
  );
}
