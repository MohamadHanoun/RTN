import EmptyState from "@/components/EmptyState";
import { retryBotEventInline } from "@/actions/adminBotEventInlineActions";
import { prisma } from "@/lib/prisma";

type BotEventStatus = "queued" | "processing" | "completed" | "failed";

const statusStyles: Record<string, string> = {
  queued: "border-yellow-400/30 bg-yellow-500/10 text-yellow-200",
  processing: "border-blue-400/30 bg-blue-500/10 text-blue-200",
  completed: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  failed: "border-red-400/30 bg-red-500/10 text-red-200",
  cancelled: "border-gray-400/30 bg-gray-500/10 text-gray-200",
};

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatJsonPreview(value: unknown) {
  if (!value) {
    return "-";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "Unable to display data.";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
        statusStyles[status] || "border-white/10 bg-white/10 text-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status: BotEventStatus;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>

      <div className="mt-4">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

async function retryBotEventFormAction(formData: FormData) {
  "use server";

  await retryBotEventInline(formData);
}

function RetryButton({ eventId, status }: { eventId: string; status: string }) {
  if (status !== "failed") {
    return null;
  }

  return (
    <form action={retryBotEventFormAction}>
      <input type="hidden" name="eventId" value={eventId} />

      <button
        type="submit"
        className="rounded-xl border border-violet-400/35 bg-violet-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-violet-100 transition hover:border-violet-300 hover:bg-violet-500/25"
      >
        Retry
      </button>
    </form>
  );
}

export default async function AdminBotEventsPanel() {
  const [queuedCount, processingCount, completedCount, failedCount, events] =
    await Promise.all([
      prisma.botEvent.count({
        where: {
          status: "queued",
        },
      }),
      prisma.botEvent.count({
        where: {
          status: "processing",
        },
      }),
      prisma.botEvent.count({
        where: {
          status: "completed",
        },
      }),
      prisma.botEvent.count({
        where: {
          status: "failed",
        },
      }),
      prisma.botEvent.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 30,
      }),
    ]);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            Bot control
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">Bot events</h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Track Discord operations created by Ascendra and retry failed bot
            work when needed.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Queued" value={queuedCount} status="queued" />
        <StatCard
          label="Processing"
          value={processingCount}
          status="processing"
        />
        <StatCard label="Completed" value={completedCount} status="completed" />
        <StatCard label="Failed" value={failedCount} status="failed" />
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No bot events yet."
          description="Bot events will appear here when tournaments, registrations, announcements, and Discord operations are created."
        />
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20"
            >
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <StatusBadge status={event.status} />

                    <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-gray-300">
                      {event.type}
                    </span>
                  </div>

                  <h3 className="break-words text-xl font-black text-white">
                    {event.entityType || "event"}{" "}
                    {event.entityId ? `· ${event.entityId}` : ""}
                  </h3>

                  <div className="mt-3 grid gap-2 text-sm text-gray-400 md:grid-cols-2 xl:grid-cols-4">
                    <p>
                      <span className="font-bold text-gray-300">Created:</span>{" "}
                      {formatDate(event.createdAt)}
                    </p>

                    <p>
                      <span className="font-bold text-gray-300">Updated:</span>{" "}
                      {formatDate(event.updatedAt)}
                    </p>

                    <p>
                      <span className="font-bold text-gray-300">Attempts:</span>{" "}
                      {event.attempts}/{event.maxAttempts}
                    </p>

                    <p>
                      <span className="font-bold text-gray-300">
                        Processed:
                      </span>{" "}
                      {formatDate(event.processedAt)}
                    </p>
                  </div>

                  {event.error && (
                    <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                      {event.error}
                    </div>
                  )}
                </div>

                <RetryButton eventId={event.id} status={event.status} />
              </div>

              <details className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
                <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.12em] text-gray-300">
                  Payload
                </summary>

                <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-gray-300">
                  {formatJsonPreview(event.payload)}
                </pre>
              </details>

              {event.result && (
                <details className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.12em] text-gray-300">
                    Result
                  </summary>

                  <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-gray-300">
                    {formatJsonPreview(event.result)}
                  </pre>
                </details>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
