"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Users, DollarSign, Trophy } from "lucide-react";
import { useGetTournamentByUserIdQuery } from "@/redux/apiHooks/tournament/tournamentApi";

interface Division {
  id: string;
  name: string;
  status: "Ready" | "Pending";
  teamsRegistered: number;
  teamsTotal: number;
  revenue: string;
  matchesScheduled: string;
  progressPercentage: number;
}

export default function TournamentManagePage() {
  const params = useParams();
  const tournamentId = params.id as string;

  const {
    data: tournamentData,
    isLoading,
    error,
  } = useGetTournamentByUserIdQuery(tournamentId, {
    skip: !tournamentId,
  });

  const divisions = useMemo<Division[]>(() => {
    if (!tournamentData?.data?.data?.tournamentDivisions) {
      return [
        {
          id: "1",
          name: "Loading...",
          status: "Pending",
          teamsRegistered: 0,
          teamsTotal: 0,
          revenue: "$0",
          matchesScheduled: "Pending",
          progressPercentage: 0,
        },
      ];
    }

    return tournamentData.data.data.tournamentDivisions.map((div) => {
      const teamsRegistered = div.maxTeams - (div.slotsLeft || 0);
      const progressPercentage = Math.round(
        (teamsRegistered / div.maxTeams) * 100,
      );

      return {
        id: div.id,
        name: div.divisionName,
        status: div.status === "PENDING" ? "Pending" : "Ready",
        teamsRegistered,
        teamsTotal: div.maxTeams,
        revenue: `$${div.revenue || 0}`,
        matchesScheduled: div.isScheduled ? "Complete" : "Pending",
        progressPercentage,
      };
    });
  }, [tournamentData]);

  const stats = useMemo(() => {
    if (!tournamentData?.data?.stats) {
      return {
        totalDivisions: 0,
        activeDivisions: 0,
        totalTeams: 0,
        totalRevenue: 0,
      };
    }
    return tournamentData.data.stats;
  }, [tournamentData]);

  const tournament = useMemo(() => {
    if (!tournamentData?.data?.data) return null;
    return tournamentData.data.data;
  }, [tournamentData]);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard/admin/tournament">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors cursor-pointer">
              <ChevronLeft size={20} />
              Back to All Tournaments
            </button>
          </Link>
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 sm:p-6 text-red-400">
            <p>Error loading tournament details. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard/admin/tournament">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors cursor-pointer">
              <ChevronLeft size={20} />
              Back to All Tournaments
            </button>
          </Link>
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 sm:p-6 text-yellow-400">
            <p>No tournament found.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    return status === "Ready"
      ? "bg-green-500/20 text-green-400 border border-green-500"
      : "bg-orange-500/20 text-orange-400 border border-orange-500";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 80) return "bg-yellow-400";
    return "bg-orange-500";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard/admin/tournament">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors cursor-pointer">
              <ChevronLeft size={20} />
              Back to All Tournaments
            </button>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 wrap-break-word">
              {tournament.name || "TOURNAMENT OVERVIEW"}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Location: {tournament.location}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 sm:p-4">
              <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Divisions</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {stats.totalDivisions}
              </h3>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 sm:p-4">
              <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Active Divisions</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">
                {stats.activeDivisions}
              </h3>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 sm:p-4">
              <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Teams</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {stats.totalTeams}
              </h3>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 sm:p-4">
              <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Revenue</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#CCFF00]">
                {formatCurrency(stats.totalRevenue)}
              </h3>
            </div>
          </div>
        </div>

        {/* Tournament Details */}
        {/* {tournament && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">Tournament Stage</p>
              <p className="text-white font-bold">
                {tournament.tournamentStage}
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">Status</p>
              <p className="text-white font-bold">{tournament.status}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">Game Style</p>
              <p className="text-white font-bold">
                {tournament.gameStyle || "N/A"}
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">Fields</p>
              <p className="text-white font-bold">
                {tournament.numberOfFields}
              </p>
            </div>
          </div>
        )} */}

        {/* Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {divisions.map((division) => (
            <div
              key={division.id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-gray-700 transition-colors"
            >
              {/* Division Name and Status */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 wrap-break-word">
                  {division.name}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                    division.status,
                  )}`}
                >
                  {division.status === "Ready" ? "✓ Ready" : "⏱ Pending"}
                </span>
              </div>

              {/* Division Info */}
              <div className="rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                {/* Teams */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Users size={14} className="shrink-0 text-gray-400" />
                    <p className="text-gray-400 text-xs sm:text-sm truncate">Teams Registered</p>
                  </div>
                  <p className="text-white font-bold text-xs sm:text-sm shrink-0 ml-2">
                    {division.teamsRegistered}/{division.teamsTotal}
                  </p>
                </div>

                {/* Revenue */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <DollarSign size={14} className="shrink-0 text-gray-400" />
                    <p className="text-gray-400 text-xs sm:text-sm truncate">Revenue</p>
                  </div>
                  <p className="text-[#CCFF00] font-bold text-xs sm:text-sm shrink-0 ml-2">
                    {division.revenue}
                  </p>
                </div>

                {/* Matches */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Trophy size={14} className="shrink-0 text-gray-400" />
                    <p className="text-gray-400 text-xs sm:text-sm truncate">Matches Scheduled</p>
                  </div>
                  <span
                    className={`shrink-0 ml-2 text-xs font-bold px-2 py-1 rounded ${
                      division.matchesScheduled === "Complete"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {division.matchesScheduled}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(
                      division.progressPercentage,
                    )} transition-all`}
                    style={{ width: `${division.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Manage Button */}
              {division.id && (
                <Link
                  href={`/dashboard/admin/tournament/manage/${tournamentId}/division/${encodeURIComponent(division.id)}`}
                >
                  <button className="w-full bg-[#CCFF00] hover:bg-[#B8E600] text-black font-bold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-colors cursor-pointer">
                    Manage
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
