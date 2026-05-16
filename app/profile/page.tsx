import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CreateTeamForm from "@/components/CreateTeamForm";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ProfileDiscordId from "@/components/ProfileDiscordId";
import ProfileInvitationsPanel from "@/components/ProfileInvitationsPanel";
import ProfileLogoutButton from "@/components/ProfileLogoutButton";
import ProfileNotice from "@/components/ProfileNotice";
import TeamFlowGuide from "@/components/TeamFlowGuide";
import TeamManagementCard from "@/components/TeamManagementCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your RTN player profile.",
};

type ProfilePageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.databaseId) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.databaseId,
    },
    include: {
      ownedTeams: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          members: {
            include: {
              user: true,
            },
            orderBy: {
              joinedAt: "asc",
            },
          },
          invites: {
            include: {
              invitedUser: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
      teamMemberships: {
        include: {
          team: true,
        },
        orderBy: {
          joinedAt: "desc",
        },
      },
      receivedTeamInvites: {
        where: {
          status: "pending",
        },
        include: {
          team: true,
          invitedBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const memberTeams = user.teamMemberships
    .map((membership) => membership.team)
    .filter((team) => team.leaderId !== user.id);

  const hasTeams = user.ownedTeams.length > 0 || memberTeams.length > 0;

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="Player Profile"
        title={`Welcome, ${user.username}`}
        description="Manage your RTN profile, teams, invitations, and future tournament activity."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <ProfileNotice message={params.message} error={params.error} />

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={92}
                  height={92}
                  className="rounded-3xl border border-white/10"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-indigo-500/20 text-2xl font-black text-indigo-300">
                  RTN
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                  RTN Player
                </p>

                <h2 className="truncate text-3xl font-black md:text-4xl">
                  {user.username}
                </h2>

                <div className="mt-4 max-w-lg">
                  <ProfileDiscordId discordId={user.discordId} />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div
                className={`rounded-2xl border p-4 ${
                  user.isGuildMember
                    ? "border-green-500/20 bg-green-500/10"
                    : "border-yellow-500/20 bg-yellow-500/10"
                }`}
              >
                <p
                  className={`font-bold ${
                    user.isGuildMember ? "text-green-300" : "text-yellow-300"
                  }`}
                >
                  {user.isGuildMember
                    ? "RTN Discord Member"
                    : "Discord Login Active"}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-300">
                  {user.isGuildMember
                    ? "You can create teams and use RTN tournament features."
                    : "Join the RTN Discord server to create teams and use tournament features."}
                </p>
              </div>

              <ProfileInvitationsPanel invites={user.receivedTeamInvites} />

              <ProfileLogoutButton />
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <TeamFlowGuide />
          <CreateTeamForm canCreateTeam={user.isGuildMember} />
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                Teams
              </p>

              <h2 className="text-3xl font-black">My Teams</h2>
            </div>

            <p className="text-sm text-gray-400">
              Draft, pending, approved, and rejected teams appear here.
            </p>
          </div>

          {!hasTeams ? (
            <EmptyState
              title="No teams yet"
              description="Your teams will appear here after you create or join an RTN team."
            />
          ) : (
            <div className="grid gap-6">
              {user.ownedTeams.map((team) => (
                <TeamManagementCard key={team.id} team={team} />
              ))}

              {memberTeams.map((team) => (
                <article
                  key={team.id}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Member
                      </p>

                      <h3 className="text-2xl font-black">{team.name}</h3>

                      <p className="mt-2 text-gray-300">{team.game}</p>
                    </div>

                    <span className="rounded-full bg-indigo-500/20 px-4 py-1 text-sm font-bold text-indigo-300">
                      {team.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}
