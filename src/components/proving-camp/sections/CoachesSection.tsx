"use client";

import Image from "next/image";
import { useState } from "react";
import SectionHeading from "@/components/proving-camp/sections/SectionHeading";
import { useGetCampCoachListQuery } from "@/redux/apiHooks/camp/coachApi";

const coachImageSizes =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw";

const getCoachExcerpt = (bio: string, maxLength = 200) => {
  if (!bio || bio.length <= maxLength) return bio;
  return `${bio.slice(0, maxLength).trimEnd()}...`;
};

type Coach = {
  id: string;
  name: string;
  badge?: string;
  role?: string;
  coachBio?: string;
  image?: string;
};

export default function CoachesSection() {
  const [expandedCoach, setExpandedCoach] = useState<string | null>(null);

  const {
    data: coachesData,
    isLoading,
    isError,
  } = useGetCampCoachListQuery({
    page: 1,
    limit: 100,
  });

  const coaches: Coach[] = coachesData?.data ?? [];

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto w-full max-w-368 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Coached by People Who Have Been There"
          subtitle="Every Crown & Pitch Proving Camp session is staffed by coaches with real
playing credentials: former professional players, active NTX Lions semi-pro
players, collegiate players, and select high-level high school players. All coaches
are personally selected by Dean Robertson, camp director, former pro player,
and NTX Lions head coach."
        />

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-125 animate-pulse rounded-xl border border-white/10 bg-[#121212]"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-sm text-red-400">
            Failed to load coaches.
          </p>
        ) : coaches.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No coaches found.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
            {coaches.map((coach) => {
              const bio = coach.coachBio ?? "";
              const hasLongBio = bio.length > 200;
              const isExpanded = expandedCoach === coach.id;

              return (
                <article
                  key={coach.id}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#2A3140] bg-[#0F131B] shadow-[0_16px_45px_-30px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CCFF00]/50"
                >
                  <div className="relative h-56 w-full bg-[#10131A]">
                    {coach.image ? (
                      <Image
                        src={coach.image}
                        alt={coach.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        quality={80}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1A1A1A] text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex grow flex-col gap-3 border-t border-white/20 p-4">
                    <div className="space-y-2">
                      <h3 className="font-['Oswald'] text-lg leading-tight text-white">
                        {coach.name}
                      </h3>
                      {coach.role ? (
                        <p className="w-full rounded-sm bg-[#CCFF001A] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#ccff00]">
                          {coach.role}
                        </p>
                      ) : null}

                      {coach.badge ? (
                        <p className="w-full rounded-sm bg-[#CCFF001A] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#ccff00]">
                          {coach.badge}
                        </p>
                      ) : null}
                    </div>

                    {hasLongBio ? (
                      <div className="relative">
                        <p
                          className={`text-sm leading-6 text-gray-300/90 transition-all duration-300 ease-out motion-reduce:transition-none ${
                            isExpanded
                              ? "max-h-0 -translate-y-1 overflow-hidden opacity-0"
                              : "max-h-32 translate-y-0 opacity-100"
                          }`}
                        >
                          {getCoachExcerpt(bio)}
                        </p>

                        <div
                          className={`grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                            isExpanded
                              ? "grid-rows-[1fr] translate-y-0 opacity-100"
                              : "grid-rows-[0fr] -translate-y-1 opacity-0"
                          }`}
                        >
                          <p className="overflow-hidden text-sm leading-6 text-gray-300/90">
                            {bio}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm leading-6 text-gray-300/90">
                        {bio}
                      </p>
                    )}

                    {hasLongBio ? (
                      <button
                        type="button"
                        className="mt-auto inline-flex w-fit items-center gap-1 text-sm font-medium text-[#ccff00] transition-colors duration-300 hover: text-[#ccff00]"
                        onClick={() =>
                          setExpandedCoach((prev) =>
                            prev === coach.id ? null : coach.id,
                          )
                        }
                      >
                        {isExpanded ? "Read less" : "Read more"}
                        <span
                          className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          ▾
                        </span>
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
