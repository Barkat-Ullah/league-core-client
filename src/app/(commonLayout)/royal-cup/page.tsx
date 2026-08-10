import RoyalCupPage from "@/components/module/RoyelCup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Royal Cup | Crown & Pitch",
  description:
    "Explore the Royal Cup at Crown & Pitch, including tournament format, team participation, entry details, and championship experience.",
  keywords: [
    "Royal Cup",
    "Crown & Pitch",
    "soccer tournament",
    "championship",
    "team participation",
    "sports event",
  ],
  alternates: {
    canonical: "https://platform.leaguecore.barkatullah.dev/royal-cup",
  },
  openGraph: {
    title: "Royal Cup | Crown & Pitch",
    description:
      "Explore the Royal Cup at Crown & Pitch, including tournament format, team participation, entry details, and championship experience.",
    url: "https://platform.leaguecore.barkatullah.dev/royal-cup",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Cup | Crown & Pitch",
    description:
      "Explore the Royal Cup at Crown & Pitch, including tournament format, team participation, entry details, and championship experience.",
  },
};

export default function Page() {
  return (
    <div>
      <RoyalCupPage />
    </div>
  );
}
