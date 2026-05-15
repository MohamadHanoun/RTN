import {
  deleteTournament,
  updateTournament,
} from "@/actions/tournamentActions";
import AdminTournamentListClient from "@/components/AdminTournamentListClient";
import { prisma } from "@/lib/prisma";

async function getTournaments() {
  return prisma.tournament.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
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