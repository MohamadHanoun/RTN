import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Footer from "@/components/Footer";
import LoginWithDiscordButton from "@/components/LoginWithDiscordButton";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Login | Ascendra",
  description: "Login to Ascendra with Discord.",
};

function BenefitCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
      <p className="font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
    </div>
  );
}

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.databaseId) {
    redirect("/profile");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16)_0%,transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#090b15_42%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="relative min-h-[720px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/backgrounds/community-hero.webp")',
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,17,0.90)_0%,rgba(7,8,17,0.62)_44%,rgba(7,8,17,0.78)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.22),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#070811]/75 to-[#070811]" />

          <div className="relative z-10 mx-auto grid min-h-[720px] max-w-[1440px] gap-10 px-6 pb-28 pt-20 lg:grid-cols-[1fr_420px] lg:items-center lg:px-10">
            <div>
              <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                Ascendra login
              </p>

              <h1 className="max-w-5xl text-5xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl">
                Enter the platform with Discord.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                Use your Discord account to access your Ascendra profile, teams,
                invitations, tournament registration, and future realtime
                features.
              </p>
            </div>

            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-2xl border border-violet-400/25 bg-violet-500/10 p-5">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
                  Secure access
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Login with Discord
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-300">
                  Discord login keeps the player identity connected to teams,
                  invites, and tournament activity.
                </p>

                <div className="mt-6">
                  <LoginWithDiscordButton />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <BenefitCard
                  title="Create and manage teams"
                  description="Build your squad, invite members, and manage your team page."
                />
                <BenefitCard
                  title="Join tournaments"
                  description="Register eligible teams when tournament registration is open."
                />
                <BenefitCard
                  title="Track progress"
                  description="Follow tournament points, placements, and leaderboard progress."
                />
              </div>
            </section>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
