import { currentContent } from "@/content/siteContent";

export const serverInfo = {
  name: currentContent.siteName,
  shortName: currentContent.shortName,
  highlightedName: currentContent.highlightedName,
  description: currentContent.home.description,
  inviteUrl: currentContent.inviteUrl,
  footerText: currentContent.footer,
};