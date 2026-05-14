export type TournamentStatus = "open" | "upcoming" | "closed" | "finished";

export type Tournament = {
  id: number;
  title: string;
  game: string;
  date: string;
  prize: string;
  teams: string;
  status: TournamentStatus;
  description: string;
};

export const tournaments: Tournament[] = [
  {
    id: 1,
    title: "DISCORE Valorant Cup",
    game: "Valorant",
    date: "Coming soon",
    prize: "To be announced",
    teams: "8 Teams",
    status: "upcoming",
    description:
      "A competitive Valorant tournament for community members. Registration will open soon.",
  },
  {
    id: 2,
    title: "Rocket League Night",
    game: "Rocket League",
    date: "Coming soon",
    prize: "Community rewards",
    teams: "16 Players",
    status: "upcoming",
    description:
      "A fun tournament night for players who want to compete and enjoy the community.",
  },
  {
    id: 3,
    title: "Fortnite Build Battle",
    game: "Fortnite",
    date: "Coming soon",
    prize: "To be announced",
    teams: "Solo",
    status: "closed",
    description:
      "This tournament section is prepared for future registration and admin management.",
  },
];