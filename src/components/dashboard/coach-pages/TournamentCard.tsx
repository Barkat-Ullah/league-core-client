"use client";

import { MapPin, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export type TournamentStatus =
  | "NO_PLAYERS"
  | "ROSTER_INCOMPLETE"
  | "ROSTER_COMPLETE";

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  ageGroup: string;
  status?: string;
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const router = useRouter();

  const getStatusText = () => {
    switch (tournament.status) {
      case "NO_PLAYERS":
        return "NO PLAYERS";
      case "ROSTER_INCOMPLETE":
        return "ROSTER INCOMPLETE";
      case "ROSTER_COMPLETE":
        return "ROSTER COMPLETE";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        onClick={() =>
          router.push(`/dashboard/coach/tournament/${tournament.id}`)
        }
        className="border border-gray-800 rounded-lg p-5 sm:p-6 transition-colors bg-transparent cursor-pointer group hover:border-[#CCFF00]"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-base lg:text-lg font-bold text-white group-hover:text-[#CCFF00] transition flex-1 min-w-0 wrap-break-word">
            {tournament.name}
          </h3>
          {tournament.status && (
            <span className="px-3 py-1 rounded text-xs font-medium border border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00] shrink-0 text-center">
              {getStatusText()}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={14} className="text-[#CCFF00] shrink-0" />
            <span>{tournament.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={14} className="text-[#CCFF00] shrink-0" />
            <span>{tournament.ageGroup}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={14} className="text-[#CCFF00] shrink-0" />
            <span className="truncate">{tournament.location}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition text-center border border-gray-700 rounded-lg px-3 py-2">
          Click to view tournament details and schedule
        </p>
      </div>
    </>
  );
}
