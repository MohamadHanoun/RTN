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
    title: "RTN Community Cup",
    game: "Multi-Game",
    date: "Coming soon",
    prize: "To be announced",
    teams: "Open slots",
    status: "upcoming",
    description:
      "A future RTN tournament designed for players from different electronic games. Registration will open later through the website.",
  },
  {
    id: 2,
    title: "RTN Ranked Night",
    game: "Competitive Games",
    date: "Coming soon",
    prize: "Community rewards",
    teams: "Limited slots",
    status: "upcoming",
    description:
      "A planned event for competitive players who want to join organized matches and community challenges.",
  },
  {
    id: 3,
    title: "RTN Casual Event",
    game: "Community Games",
    date: "Coming soon",
    prize: "Fun rewards",
    teams: "Open for members",
    status: "upcoming",
    description:
      "A casual event for members who want to play, meet others, and enjoy the community without pressure.",
  },
];