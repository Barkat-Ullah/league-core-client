"use client";

import { useGetMeQuery } from "@/redux/apiHooks/auth/authApi";
import { useGetMyTeamQuery } from "@/redux/apiHooks/team/teamApi";
import { Bell, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { NavUser } from "./nav-user";

import { setSelectedTeamId } from "@/redux/features/teamSelection/teamSelectionSclice";
import type { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const PREFERRED_TEAM_ID_KEY = "preferredTeamId";

type Team = {
  id: string;
  teamName: string;
  division: string;
  image: string | null;
};

const AppHeader = () => {
  const dispatch = useDispatch();

  const selectedTeamId = useSelector(
    (state: RootState) => state.teamSelection.selectedTeamId,
  );

  const { data: getProfile } = useGetMeQuery(undefined);
  const userData = getProfile?.data;

  const user = {
    name: userData?.fullName,
    email: userData?.email,
    avatar: userData?.profileImage,
  };

  const role = userData?.role;

  const isCoachOrManager = role === "COACH" || role === "MANAGER";

  const {
    data: teamData,
    isLoading: teamLoading,
    isError: teamError,
  } = useGetMyTeamQuery(undefined, {
    skip: !isCoachOrManager,
  });

  const teams: Team[] = useMemo(() => {
    return (teamData?.data ?? []) as Team[];
  }, [teamData]);

  const [isOpen, setIsOpen] = useState(false);

  // ✅ Set default selected team globally when teams arrive
  useEffect(() => {
    if (!teams.length) {
      // optional: clear selection if no teams
      dispatch(setSelectedTeamId(null));
      return;
    }

    const preferredTeamId = localStorage.getItem(PREFERRED_TEAM_ID_KEY);
    if (preferredTeamId) {
      const preferredExists = teams.some((t) => t.id === preferredTeamId);
      if (preferredExists && selectedTeamId !== preferredTeamId) {
        dispatch(setSelectedTeamId(preferredTeamId));
      }
      localStorage.removeItem(PREFERRED_TEAM_ID_KEY);
      return;
    }

    // if not selected yet OR selected team doesn't exist anymore -> pick first
    const exists = selectedTeamId
      ? teams.some((t) => t.id === selectedTeamId)
      : false;

    if (!selectedTeamId || !exists) {
      dispatch(setSelectedTeamId(teams[0].id));
    }
  }, [teams, selectedTeamId, dispatch]);

  // derive selected team object from global id
  const selectedTeam = useMemo(() => {
    if (!teams.length) return null;
    return teams.find((t) => t.id === selectedTeamId) ?? teams[0];
  }, [teams, selectedTeamId]);

  return (
    <header className="flex min-h-16 shrink-0 flex-nowrap items-center justify-between gap-x-2 gap-y-1 bg-[#0A0A0A] border-b border-gray-800 px-3 sm:px-6">
      {/* Left Side */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
      </div>

      {/* Right Side */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {isCoachOrManager ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen((v) => !v)}
              disabled={teamLoading || !!teamError || teams.length === 0}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 max-w-[52vw] sm:max-w-none bg-gray-900 border border-gray-700 rounded-lg text-gray-200 hover:border-[#CCFF00]/50 hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="truncate overflow-hidden text-ellipsis">
                {teamLoading
                  ? "Loading teams..."
                  : teamError
                    ? "Failed to load teams"
                    : (selectedTeam?.teamName ?? "No team")}
              </span>

              <ChevronDown
                className={`shrink-0 w-4 h-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && !teamLoading && !teamError && teams.length > 0 && (
              <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-full sm:mt-2 w-[calc(100vw-1.5rem)] sm:w-72 max-w-[95vw] sm:max-w-72 max-h-80 overflow-y-auto overscroll-contain bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 py-2 pr-1 [scrollbar-width:thin] [scrollbar-color:#CCFF00_#1f2937] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCFF00]/70 hover:[&::-webkit-scrollbar-thumb]:bg-[#CCFF00]">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      dispatch(setSelectedTeamId(team.id));
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                      selectedTeamId === team.id
                        ? "bg-[#CCFF00]/20 text-[#CCFF00] font-semibold"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-gray-800 overflow-hidden shrink-0">
                      {team.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={team.image}
                          alt={team.teamName}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-col">
                      <span>{team.teamName}</span>
                      <span className="text-xs text-gray-400">
                        {team.division}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!teamLoading && !teamError && teams.length === 0 && (
              <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-full sm:mt-2 w-[calc(100vw-1.5rem)] sm:w-72 max-w-[95vw] sm:max-w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 p-3 text-sm text-gray-300">
                No teams found.
              </div>
            )}
          </div>
        ) : (
          <NavUser user={user} />
        )}

        <button className="relative p-2 text-gray-400 hover:text-gray-200 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
