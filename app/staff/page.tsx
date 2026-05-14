import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import StaffCard from "@/components/StaffCard";
import { staffMembers } from "@/data/staff";

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Staff"
        title="The team behind The Noobs of Temple & Rift."
        description="This page is prepared for RTN staff members, future Discord avatars, staff profiles, developer members, and admin management."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-cyan-300">
            Staff Profiles Coming Later
          </h2>

          <p className="leading-7 text-gray-300">
            The current staff section uses simple placeholder cards. Later, this
            page can show real Discord avatars, staff roles, developer profiles,
            and live information from the database.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {staffMembers.map((member) => (
            <StaffCard
              key={member.name}
              name={member.name}
              role={member.role}
              status={member.status}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}