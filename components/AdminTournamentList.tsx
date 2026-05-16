import {
  deleteTournament,
  updateTournament,
} from "@/actions/tournamentActions";
import AdminTournamentListClient from "@/components/AdminTournamentListClient";
import { prisma } from "@/lib/prisma";

async function getTournaments() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      game: true,
      date: true,
      prize: true,
      description: true,
      maxSlots: true,
      teamSize: true,
      status: true,
      registrationStatus: true,
    },
    take: 50,
  });

  return tournaments.map((tournament) => ({
    ...tournament,
    teamSize: tournament.teamSize ?? 1,
    registrationStatus: tournament.registrationStatus ?? "closed",
  }));
}

export default async function AdminTournamentList() {
  const tournaments = await getTournaments();

  return (
    <AdminTournamentListClient
      tournaments={tournaments}
      updateTournament={updateTournament}
      deleteTournament={deleteTournament}
    />
  );
}
