import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ProfileNotice from "@/components/ProfileNotice";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tournaments",
  description: "Browse RTN tournaments.",
};

type TournamentsPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    open: "border-green-500/20 bg-green-500/10 text-green-300",
    approved: "border-green-500/20 bg-green-500/10 text-green-300",
    upcoming: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    closed: "border-red-500/20 bg-red-500/10 text-red-300",
    rejected: "border-red-500/20 bg-red-500/10 text-red-300",
    registered: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  };

  return (
    <span
      className={`inline-flex w-fit rounded border px-3 py-1 text-xs font-bold capitalize ${
        styles[normalizedStatus] || "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

function RegistrationBadge({ status }: { status: string }) {
  if (status === "open") {
    return <StatusBadge status="Open" />;
  }

  return <StatusBadge status="Closed" />;
}

export default async function TournamentsPage({
  searchParams,
}: TournamentsPageProps) {
  const params = await searchParams;

  const tournaments = await prisma.tournament.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      game: true,
      description: true,
      date: true,
      prize: true,
      maxSlots: true,
      teamSize: true,
      status: true,
      registrationStatus: true,
      registrations: {
        where: {
          status: {
            in: ["registered", "approved"],
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Tournaments"
        title="Browse RTN tournaments."
        description="Find upcoming tournaments, check registration status, and open a tournament page to view details or register your approved team."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <ProfileNotice message={params.message} error={params.error} />

        {tournaments.length === 0 ? (
          <EmptyState
            title="No tournaments yet"
            description="RTN tournaments will appear here when they are created by the admin team."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <h2 className="text-xl font-black text-white">Tournament List</h2>

              <p className="mt-1 text-sm text-gray-400">
                Open a tournament to view full details and registration options.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-xs font-black uppercase tracking-[0.12em] text-gray-400">
                    <th className="w-[32%] px-5 py-4">Tournament</th>
                    <th className="w-[14%] px-5 py-4">Game</th>
                    <th className="w-[12%] px-5 py-4">Team Size</th>
                    <th className="w-[12%] px-5 py-4">Slots</th>
                    <th className="w-[12%] px-5 py-4">Status</th>
                    <th className="w-[12%] px-5 py-4">Registration</th>
                    <th className="w-[6%] px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tournaments.map((tournament) => {
                    const usedSlots = tournament.registrations.length;
                    const remainingSlots = Math.max(
                      tournament.maxSlots - usedSlots,
                      0,
                    );

                    return (
                      <tr
                        key={tournament.id}
                        className="border-b border-white/10 transition last:border-b-0 hover:bg-white/[0.035]"
                      >
                        <td className="px-5 py-5 align-middle">
                          <p className="font-black text-white">
                            {tournament.title}
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            {tournament.date} · Prize: {tournament.prize}
                          </p>
                        </td>

                        <td className="px-5 py-5 align-middle text-gray-300">
                          {tournament.game}
                        </td>

                        <td className="px-5 py-5 align-middle">
                          <span className="font-bold text-white">
                            {tournament.teamSize}v{tournament.teamSize}
                          </span>
                        </td>

                        <td className="px-5 py-5 align-middle">
                          <p className="font-bold text-white">
                            {usedSlots}/{tournament.maxSlots}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {remainingSlots} left
                          </p>
                        </td>

                        <td className="px-5 py-5 align-middle">
                          <StatusBadge status={tournament.status} />
                        </td>

                        <td className="px-5 py-5 align-middle">
                          <RegistrationBadge
                            status={tournament.registrationStatus}
                          />
                        </td>

                        <td className="px-5 py-5 text-right align-middle">
                          <Link
                            href={`/tournaments/${tournament.id}`}
                            className="inline-flex rounded bg-indigo-500 px-4 py-2 text-sm font-black text-white transition hover:bg-indigo-400"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
