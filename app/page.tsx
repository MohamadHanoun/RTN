export default function Home() {
  const stats = [
    { label: "Members", value: "500+" },
    { label: "Channels", value: "25+" },
    { label: "Events", value: "Weekly" },
    { label: "Active Staff", value: "24/7" },
  ];

  const features = [
    {
      title: "Active Community",
      text: "Join a friendly and active Discord community with daily conversations.",
    },
    {
      title: "Gaming Events",
      text: "Take part in events, game nights, tournaments, and giveaways.",
    },
    {
      title: "Level System",
      text: "A future XP system will reward active members and show leaderboards.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          DIS<span className="text-indigo-400">CORE</span>
        </h1>

        <div className="hidden gap-8 text-sm text-gray-300 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#stats" className="hover:text-white">Stats</a>
          <a href="#rules" className="hover:text-white">Rules</a>
        </div>

        <a
          href="https://discord.gg/zP8ptXVvKw"
          target="_blank"
          className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold transition hover:bg-indigo-400"
        >
          Join Discord
        </a>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Modern Discord Community
          </p>

          <h2 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Build your place inside the community.
          </h2>

          <p className="mb-8 max-w-xl text-lg leading-8 text-gray-300">
            A modern Discord server for gaming, events, friends, voice chats,
            and future XP rewards connected directly with our custom bot.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://discord.gg/YOUR_INVITE"
              target="_blank"
              className="rounded-xl bg-indigo-500 px-7 py-4 font-bold transition hover:bg-indigo-400"
            >
              Join Server
            </a>

            <a
              href="#features"
              className="rounded-xl border border-white/10 px-7 py-4 font-bold text-gray-200 transition hover:bg-white/10"
            >
              Explore More
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-500/10">
          <div className="mb-6 h-64 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400" />

          <h3 className="mb-3 text-2xl font-bold">Server Highlights</h3>
          <p className="text-gray-300">
            XP system, real Discord stats, admin panel, bot integration, and
            leaderboard will be added step by step.
          </p>
        </div>
      </section>

      <section id="stats" className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-4xl font-black text-indigo-400">{item.value}</p>
              <p className="mt-2 text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-10 text-4xl font-black">Server Features</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
              <p className="leading-7 text-gray-300">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="rules" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-4xl font-black">Basic Rules</h2>

          <ul className="space-y-4 text-gray-300">
            <li>01. Respect all members.</li>
            <li>02. No spam or advertising.</li>
            <li>03. Use the correct channels.</li>
            <li>04. Follow Discord Terms of Service.</li>
          </ul>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-gray-400">
        © 2026 DISCORE Community. All rights reserved.
      </footer>
    </main>
  );
}