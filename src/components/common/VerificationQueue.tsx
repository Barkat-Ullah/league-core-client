/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Check, Search, Loader2 } from "lucide-react";
import {
  useGetTeamPlayersQuery,
  useUpdateTeamPlayerStatusMutation,
  TeamPlayer,
} from "../../redux/apiHooks/teamPlayers/teamPlayersApi";
import Spinner from "./Spinner";

interface SelectedPlayer {
  id: string;
  name: string;
  division: string;
  status: string;
  ageVerified: string;
  profileImage?: string | null;
  note: string;
  dob: string;
}

// Fade/slide duration for the "item leaves the queue" animation. Kept in one
// place so the setTimeout below and the CSS transition duration always match.
const REMOVE_ANIM_MS = 280;
const PAGE_LIMIT = 10;

// Lightweight pulse skeleton for the very first load only — avoids ever
// showing a blank/spinner-only panel again once real data has arrived once.
function QueueRowSkeleton() {
  return (
    <div className="w-full p-4 rounded-lg border-2 border-gray-800 bg-gray-900/40">
      <div className="flex items-start justify-between gap-2 animate-pulse">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gray-700/70 rounded" />
          <div className="h-3 w-20 bg-gray-800 rounded" />
          <div className="h-5 w-24 bg-gray-800 rounded" />
        </div>
        <div className="h-5 w-16 bg-gray-700/70 rounded" />
      </div>
    </div>
  );
}

export default function VerificationQueue() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ageVerifiedFilter, setAgeVerifiedFilter] =
    useState<string>("Check_in_required");
  const [actionLoading, setActionLoading] = useState<
    "approve" | "reject" | null
  >(null);

  const [rejectNote, setRejectNote] = useState("");

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetTeamPlayersQuery({ page: currentPage, limit: PAGE_LIMIT });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateTeamPlayerStatusMutation();

  const teamPlayers: TeamPlayer[] = response?.data || [];

  // Pagination meta from the API (falls back gracefully if the backend
  // doesn't send `meta` yet, so this never throws).
  const totalCount: number =
    (response as any)?.meta?.total ?? teamPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    setSelectedId(null); // previous selection won't exist on the new page
  };

  // Only true for the very first fetch that has never resolved. Later
  // background refetches (e.g. after approve/reject invalidates the cache)
  // won't flip this back on, so the panel never "reloads" from scratch again.
  const hasLoadedOnceRef = useRef(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  useEffect(() => {
    if (!isLoading && !hasLoadedOnceRef.current) {
      hasLoadedOnceRef.current = true;
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  const isInitialLoading = isLoading && !hasLoadedOnce;

  const calculateAge = (dobISO?: string) => {
    if (!dobISO) return null;
    const dob = new Date(dobISO);
    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const parseDivisionAgeRange = (divisionName?: string) => {
    if (!divisionName) return null;
    const m = divisionName.match(/U(\d+)_U(\d+)/i);
    if (!m) return null;

    const min = parseInt(m[1], 10);
    const max = parseInt(m[2], 10);
    if (Number.isNaN(min) || Number.isNaN(max)) return null;
    return { min, max };
  };

  const isAgeInDivision = (age: number | null, divisionName?: string) => {
    if (age === null) return null;
    const range = parseDivisionAgeRange(divisionName);
    if (!range) return null;
    return age >= range.min && age <= range.max;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "U";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  };

  const formatDOB = (dobISO?: string) => {
    if (!dobISO) return "Unknown";
    const d = new Date(dobISO);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const matchesAgeFilter = (age: string) => {
    if (ageVerifiedFilter === "all") return true;
    if (ageVerifiedFilter === "verified") return age === "verified";
    if (ageVerifiedFilter === "Check_in_required")
      return age === "Check_in_required" || age === "Pending";
    return true;
  };

  const filteredQueue: TeamPlayer[] = teamPlayers.filter((tp: TeamPlayer) => {
    const matchesAge = matchesAgeFilter(tp.ageVerified);
    const p = tp.player as any;

    const matchesSearch =
      (p?.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (tp.team?.tourDivision?.divisionName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );

    return matchesAge && matchesSearch;
  });

  // --------------------------------------------------------------------
  // Smooth removal: when a player is approved/rejected they usually drop
  // out of `filteredQueue` on the next server refetch (status no longer
  // matches the filter). Instead of letting them vanish instantly the
  // moment fresh data arrives, we keep a short-lived local snapshot of any
  // item mid-animation and render it until the fade-out finishes.
  // --------------------------------------------------------------------
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [pendingSnapshots, setPendingSnapshots] = useState<TeamPlayer[]>([]);

  const displayQueue: TeamPlayer[] = useMemo(() => {
    const visibleIds = new Set(filteredQueue.map((f) => f.id));
    const stillPending = pendingSnapshots.filter((p) => !visibleIds.has(p.id));
    return [...filteredQueue, ...stillPending];
  }, [filteredQueue, pendingSnapshots]);

  const beginRemoveAnimation = (item: TeamPlayer) => {
    setRemovingIds((prev) => new Set(prev).add(item.id));
    setPendingSnapshots((prev) =>
      prev.some((p) => p.id === item.id) ? prev : [...prev, item],
    );
    window.setTimeout(() => {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      setPendingSnapshots((prev) => prev.filter((p) => p.id !== item.id));
    }, REMOVE_ANIM_MS);
  };

  const selectedRaw =
    displayQueue.find((p: TeamPlayer) => p.id === selectedId) ||
    displayQueue[0];

  const selectedPlayer: SelectedPlayer | null = selectedRaw
    ? (() => {
        const p = selectedRaw.player as any;
        return {
          id: selectedRaw.id,
          name: p?.fullName || "Unknown",
          division: selectedRaw.team?.tourDivision?.divisionName || "Unknown",
          status: selectedRaw.status,
          ageVerified: selectedRaw.ageVerified,
          note: selectedRaw.note || "",
          profileImage: p?.profileImage ?? null,
          dob: p?.dob || "",
        };
      })()
    : null;

  const selectedAge = useMemo(() => {
    return calculateAge(selectedPlayer?.dob);
  }, [selectedPlayer?.dob]);

  const ageMatchesDivision = useMemo(() => {
    return isAgeInDivision(selectedAge, selectedPlayer?.division);
  }, [selectedAge, selectedPlayer?.division]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
      case "Check_in_required":
        return "bg-orange-500";
      case "Signed":
        return "bg-blue-500";
      case "Verified":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAgeVerifiedColor = (ageVerified: string) => {
    return ageVerified === "verified"
      ? "bg-green-500/20 text-green-400"
      : ageVerified === "Rejected"
        ? "bg-red-500/20 text-red-400"
        : "bg-orange-500/20 text-orange-400";
  };

  const getAgeMatchBadge = () => {
    if (selectedAge === null) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-300">
          Age: Unknown
        </span>
      );
    }
    if (ageMatchesDivision === null) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-300">
          Age: {selectedAge} (Rule unknown)
        </span>
      );
    }
    return ageMatchesDivision ? (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
        Age: {selectedAge} ✅ Match
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
        Age: {selectedAge} ❌ Not Match
      </span>
    );
  };

  // load old note into input when selected player changes
  useEffect(() => {
    setRejectNote(selectedPlayer?.note || "");
  }, [selectedPlayer?.id, selectedPlayer?.note]);

  const handleApprove = async () => {
    if (!selectedPlayer) return;
    const target = selectedRaw;
    try {
      setActionLoading("approve");
      await updateStatus({
        id: selectedPlayer.id,
        ageVerified: "verified",
      }).unwrap();

      if (target) beginRemoveAnimation(target);

      const remaining = displayQueue.filter(
        (p: TeamPlayer) => p.id !== selectedPlayer.id,
      );
      setSelectedId(remaining[0]?.id ?? null);
    } catch (err) {
      console.error("Failed to approve player:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedPlayer) return;
    const target = selectedRaw;
    try {
      setActionLoading("reject");
      await updateStatus({
        id: selectedPlayer.id,
        ageVerified: "Rejected",
        note: rejectNote.trim() || undefined,
      }).unwrap();

      if (target) beginRemoveAnimation(target);

      const remaining = displayQueue.filter(
        (p: TeamPlayer) => p.id !== selectedPlayer.id,
      );
      setSelectedId(remaining[0]?.id ?? null);
      setRejectNote("");
    } catch (err) {
      console.error("Failed to reject player:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Verification Queue */}
      <div className="lg:col-span-1">
        {/* Search Bar and Filter */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search player or division..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00]"
            />
          </div>

          <select
            value={ageVerifiedFilter}
            onChange={(e) => setAgeVerifiedFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="Check_in_required">Pending</option>
          </select>
        </div>

        {/* Queue Title */}
        <h2 className="text-gray-400 text-xs font-bold tracking-wider mb-4">
          VERIFICATION QUEUE ({displayQueue.length})
          {isFetching && !isInitialLoading && (
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[#CCFF00] animate-pulse align-middle" />
          )}
        </h2>

        {/* Initial Loading State — skeleton rows instead of a blank spinner box,
            and only ever shown once, before the first successful fetch. */}
        {isInitialLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <QueueRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isInitialLoading && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">
              Failed to load verification queue
            </p>
          </div>
        )}

        {/* Player List — background refetches never replace this with a
            spinner again; items only ever fade out individually. */}
        {!isInitialLoading && (
          <div className="space-y-3 max-h-150 overflow-y-auto no-scrollbar pr-1">
            {displayQueue.length > 0 ? (
              displayQueue.map((item: TeamPlayer) => {
                const p = item.player as any;
                const isRemoving = removingIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => !isRemoving && setSelectedId(item.id)}
                    disabled={isRemoving}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-[${REMOVE_ANIM_MS}ms] ease-out ${
                      isRemoving
                        ? "opacity-0 -translate-x-2 scale-95 pointer-events-none"
                        : "opacity-100 translate-x-0 scale-100"
                    } ${
                      (selectedPlayer?.id ?? null) === item.id
                        ? "border-[#CCFF00] bg-[#CCFF00]/10"
                        : "border-gray-700 bg-gray-900/40 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-white">
                          {p?.fullName || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.team?.tourDivision?.divisionName || "Unknown"}
                        </p>
                        <p
                          className={`text-xs mt-2 px-2 py-1 rounded w-fit ${getAgeVerifiedColor(
                            item.ageVerified,
                          )}`}
                        >
                          Age:{" "}
                          {item.ageVerified === "verified"
                            ? "Verified"
                            : item.ageVerified === "Rejected"
                              ? "Rejected"
                              : "Check Required"}
                        </p>
                      </div>

                      <span
                        className={`${getStatusColor(
                          item.status,
                        )} text-white px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap`}
                      >
                        {item.status || "Unknown"}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  {searchQuery
                    ? "No matching players"
                    : "No players pending verification"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination — server-side paging, so this is the only way to reach
            players beyond the first PAGE_LIMIT results. */}
        {!isInitialLoading && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!canGoPrev || isFetching}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-800 border border-gray-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-600 transition-colors"
            >
              Previous
            </button>

            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!canGoNext || isFetching}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-800 border border-gray-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Player Information */}
      {isInitialLoading ? (
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-700 rounded-2xl p-8 flex items-center justify-center min-h-150">
          <Spinner />
        </div>
      ) : selectedPlayer ? (
        <div
          key={selectedPlayer.id}
          className="lg:col-span-2 bg-gray-900/40 border border-gray-700 rounded-2xl p-8 animate-[fadein_.25s_ease-out]"
        >
          <div className="flex flex-col items-start gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold">Player Information</h2>
            {getAgeMatchBadge()}
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-center gap-4 mb-8 sm:flex-row sm:items-center">
            {selectedPlayer.profileImage ? (
              <img
                src={selectedPlayer.profileImage}
                alt={selectedPlayer.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-bold text-lg">
                {getInitials(selectedPlayer.name)}
              </div>
            )}

            <div>
              <p className="text-xl font-bold text-white">
                {selectedPlayer.name}
              </p>
              <p className="text-sm text-gray-400">{selectedPlayer.division}</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="text-gray-400 text-sm font-semibold block mb-3">
                  📊 Status
                </label>
                <input
                  type="text"
                  value={selectedPlayer.status || ""}
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold block mb-3">
                  ✅ Age Verified
                </label>
                <input
                  type="text"
                  value={
                    selectedPlayer.ageVerified === "verified"
                      ? "Verified"
                      : selectedPlayer.ageVerified === "Rejected"
                        ? "Rejected"
                        : "Check Required"
                  }
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-75 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="text-gray-400 text-sm font-semibold block mb-3">
                  🗓️ Date of Birth
                </label>
                <input
                  type="text"
                  value={formatDOB(selectedPlayer.dob)}
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold block mb-3">
                  🎂 Age (Years)
                </label>
                <input
                  type="text"
                  value={selectedAge === null ? "Unknown" : String(selectedAge)}
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-75 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Note: can view old note and edit/input new note */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm font-semibold block mb-2">
              Rejection Note
            </label>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Add a note for why verification is rejected..."
              rows={3}
              disabled={
                selectedPlayer.ageVerified === "verified" ||
                actionLoading !== null
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            {selectedPlayer?.ageVerified !== "verified" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isUpdating || actionLoading !== null}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading === "approve" ? (
                    <Loader2
                      size={20}
                      strokeWidth={3}
                      className="animate-spin"
                    />
                  ) : (
                    <Check size={20} strokeWidth={3} />
                  )}
                  {actionLoading === "approve" ? "Approving..." : "Approve"}
                </button>

                <button
                  onClick={handleReject}
                  disabled={isUpdating || actionLoading !== null}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading === "reject" ? (
                    <Loader2
                      size={20}
                      strokeWidth={3}
                      className="animate-spin"
                    />
                  ) : (
                    <X size={20} strokeWidth={3} />
                  )}
                  {actionLoading === "reject" ? "Rejecting..." : "Reject"}
                </button>
              </>
            )}
          </div>

          {ageMatchesDivision === false && (
            <p className="mt-6 text-sm text-red-400">
              ⚠️ Player age does not match the division rule (
              {selectedPlayer.division}).
            </p>
          )}
        </div>
      ) : (
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-100">
          <div className="text-center">
            <Check size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              All Players Verified!
            </h2>
            <p className="text-gray-400">
              No players pending verification at this time.
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
