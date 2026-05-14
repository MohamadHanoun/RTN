import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { serverRoles } from "@/data/roles";

export default function RolesPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Roles"
        title="Roles that shape the community."
        description="This page explains the main roles inside RTN. Later, these roles can be connected to Discord, XP       levels, tournaments, and admin tools."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {serverRoles.map((role) => (
          <article
            key={role.name}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10"
          >
            <h2 className={`mb-4 text-2xl font-bold ${role.color}`}>
              {role.name}
            </h2>

            <p className="leading-7 text-gray-300">{role.description}</p>
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}