import React from "react";
import Link from "next/link";
import Image from "next/image";

// Import images
import logo from "../../../assets/logo-1.png";
import watermark from "../../../assets/wattermark.png";

const LionsPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0d0d] px-6 py-[60px] text-[#f5f5f5] font-['Open_Sans',sans-serif]">
      {/* Background Watermark */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-start overflow-hidden">
        <Image
          src={watermark}
          alt="Watermark"
          className="h-[140vh] w-auto -translate-x-[30%] object-cover opacity-50"
          priority
        />
      </div>

      {/* Main Content (max-w-7xl equivalent) */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center text-center">
        <Image
          src={logo}
          alt="Crown & Pitch Logo"
          className="-mb-2.5 h-auto w-[180px]"
          priority
        />

        <div className="mt-3 mb-3 font-oswald text-[clamp(52px,11vw,100px)] font-black uppercase leading-[0.88] tracking-[0.02em] text-[#f5f5f5]">
          Crown <em className="not-italic text-[#36bcce]">&</em> Pitch
        </div>
        <p className="mb-[60px] text-[14px] font-medium uppercase tracking-[0.15em] text-[#b0b8c4]">
          Youth Proving Series • Z-PLEX • MELISSA TX • SUMMER 2026
        </p>

        <div className="mb-[60px] flex w-full flex-wrap justify-center gap-5">
          {/* DEVELOPER NOTE: Update href to the Girls July 11-12 event registration page */}
          <Link
            href="/tournaments/6a1b544d74ec33ee30247cb8"
            className="flex w-[340px] cursor-pointer flex-col items-center justify-start rounded-lg border-none bg-[#36bcce] px-6 pb-[36px] pt-[40px] text-center text-[#0d0d0d] no-underline transition-all duration-150 hover:-translate-y-1 hover:opacity-95 active:scale-95"
          >
            <Image
              src={logo}
              alt="Logo"
              className="mb-5 h-auto w-[60px] invert brightness-0"
            />
            <span className="mb-2.5 text-[14px] font-bold uppercase tracking-[0.15em] opacity-95">
              Youth Girls
            </span>
            <span className="mb-5 font-oswald text-[30px] font-black uppercase leading-none tracking-[0.04em]">
              JULY 11-12
            </span>
            <span className="text-[14px] font-medium leading-loose opacity-95">
              U12 • U13 • U14 • U15
              <br />
              <strong>$60 Entry • $250 Team Fund Award</strong>
              <br />
              @Crown_and_Pitch
            </span>
          </Link>

          {/* DEVELOPER NOTE: Update href to the Boys August event registration page */}
          <Link
            href="/tournaments/6a31bc662faa14a109b82eeb"
            className="flex w-[340px] cursor-pointer flex-col items-center justify-start rounded-lg border-none bg-[#eebb4d] px-6 pb-[36px] pt-[40px] text-center text-[#0d0d0d] no-underline transition-all duration-150 hover:-translate-y-1 hover:opacity-95 active:scale-95"
          >
            <Image
              src={logo}
              alt="Logo"
              className="mb-5 h-auto w-[60px] invert brightness-0"
            />
            <span className="mb-2.5 text-[14px] font-bold uppercase tracking-[0.15em] opacity-95">
              Youth Boys
            </span>
            <span className="mb-5 font-oswald text-[30px] font-black uppercase leading-none tracking-[0.04em]">
              AUG 1-2
            </span>
            <span className="text-[14px] font-medium leading-loose opacity-95">
              U12 • U13 • U14 • U15
              <br />
              <strong>$450 Entry • $1,500 Team Fund Award</strong>
              <br />
              @Crown_and_Pitch
            </span>
          </Link>
        </div>

        <p className="mb-12 text-[14px] leading-relaxed tracking-[0.02em] text-[#b0b8c4]">
          <strong className="font-semibold text-[#f5f5f5]">
            More divisions coming soon
          </strong>{" "}
          - U9, U10 & U11 boys and girls, plus
          <br />
          Men's, Women's, and Coed tournaments to be announced.
          <br />
          Follow{" "}
          <strong className="font-semibold text-[#f5f5f5]">
            @Crown_and_Pitch
          </strong>{" "}
          to be first in line when registration opens
        </p>

        <div className="mx-auto mb-6 h-px w-[600px] max-w-[80%] bg-white/10"></div>

        <p className="max-w-[600px] text-[14px] leading-relaxed text-[#b0b8c4]">
          Tonight's entry discount is brought to you by Crown & Pitch - proud to
          have NXT Lions FC
          <br />
          competing in the Proving Series. Show that you follow both{" "}
          <strong className="font-semibold text-[#f5f5f5]">
            @Crown_and_Pitch
          </strong>{" "}
          and
          <br />
          <strong className="font-semibold text-[#f5f5f5]">@NTXLions</strong> at
          the gate to redeem.
        </p>
      </div>
    </div>
  );
};

export default LionsPage;
