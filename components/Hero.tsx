import { currentContent } from "@/content/siteContent";
import { serverInfo } from "@/data/server";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            {currentContent.home.label}
          </p>

          <h2 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            {currentContent.home.title}
          </h2>

          <p className="mb-8 max-w-xl text-lg leading-8 text-gray-300">
            {serverInfo.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={serverInfo.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-indigo-500 px-7 py-4 font-bold transition hover:-translate-y-1 hover:bg-indigo-400"
            >
              {currentContent.nav.joinDiscord}
            </a>

            <a
              href="/tournaments"
              className="rounded-xl border border-white/10 px-7 py-4 font-bold text-gray-200 transition hover:-translate-y-1 hover:bg-white/10"
            >
              View Tournaments
            </a>
          </div>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur">
          <div className="absolute -right-4 -top-4 rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-bold">
            RTN
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-gray-400">
              Server Identity
            </p>
            <h3 className="text-3xl font-black">
              The Noobs of Temple & Rift
            </h3>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 p-5">
              <h4 className="mb-2 font-bold">Gaming Community</h4>
              <p className="text-sm leading-6 text-gray-300">
                A place for electronic games, voice chats, tournaments, and
                community events.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h4 className="mb-2 font-bold">
                {currentContent.home.highlightTitle}
              </h4>
              <p className="text-sm leading-6 text-gray-300">
                {currentContent.home.highlightDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}