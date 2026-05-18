export type LeaderboardUser = {
  id: number | string;
  username: string;
  role: string;
  tournamentPoints: number;
  tournamentResults: number;
  rank: number;
};

export const leaderboardUsers: LeaderboardUser[] = [];
