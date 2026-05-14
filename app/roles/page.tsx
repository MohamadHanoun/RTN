import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import RoleCard from "@/components/RoleCard";
import { serverRoles } from "@/data/roles";

export default function RolesPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Roles"
        title="Roles that shape the community."
        description="This page explains the main roles inside RTN. Later, these roles can be connected to Discord, XP levels, tournaments, and admin tools."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-indigo-300">
            Discord Role Sync Coming Later
          </h2>

          <p className="leading-7 text-gray-300">
            These roles are currently displayed from static website data. Later,
            the RTN bot can connect them with real Discord roles, XP rewards,
            tournament roles, and admin permissions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serverRoles.map((role) => (
            <RoleCard
              key={role.name}
              name={role.name}
              color={role.color}
              description={role.description}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}