export type Announcement = {
  id: number;
  title: string;
  category: string;
  date: string;
  description: string;
  important: boolean;
};

export const announcements: Announcement[] = [
  {
    id: 1,
    title: "Website Launch",
    category: "Update",
    date: "Coming soon",
    description:
      "Our new community website is being prepared with pages for rules, roles, tournaments, stats, and future Discord integration.",
    important: true,
  },
  {
    id: 2,
    title: "Tournament System",
    category: "Tournaments",
    date: "Coming soon",
    description:
      "Tournament registration, team slots, brackets, and results will be added in a future update.",
    important: false,
  },
  {
    id: 3,
    title: "XP System Planning",
    category: "Bot",
    date: "Future update",
    description:
      "A custom Discord bot will later track activity, XP, levels, and leaderboards.",
    important: false,
  },
];