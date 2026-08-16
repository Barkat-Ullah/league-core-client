"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Mail, Megaphone, Send } from "lucide-react";
import waterMark from "@/assets/newsletter.svg";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Simulated request - swap with a real subscribe API call later.
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thanks for subscribing! You're on the list.");
      setEmail("");
    }, 800);
  };

  return (
    <section className="relative w-full overflow-hidden py-8 md:py-12">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-center justify-between gap-8 md:flex-row">
{/* Copy + subscribe form */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/45 bg-[#CCFF00]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#CCFF00]">
              <Megaphone size={14} />
              Stay In The Loop
            </span>

            <h2 className="font-['Oswald'] mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Subscribe To The <span className="text-[#CCFF00]">Newsletter</span>
            </h2>

            <div className="mt-4 h-1 w-24 rounded bg-[#CCFF00]" />

            <p
              className="mt-5 text-base leading-relaxed text-gray-300 sm:text-lg"
              style={{ fontFamily: "Open Sans" }}
            >
              Be the first to know when our tournaments, schedules and store
              drops go live on the Proving Ground.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row"
            >
              <div className="relative min-w-0 flex-1">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full rounded-lg border border-[#444] bg-[#1A1A1A] py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/40"
                  style={{ fontFamily: "Open Sans" }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#CCFF00] px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-[#B8E600] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Subscribing…
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Subscribe
                  </>
                )}
              </button>
            </form>

            <p
              className="mt-4 text-sm text-gray-500"
              style={{ fontFamily: "Open Sans" }}
            >
              No spam, ever. Just the good stuff.
            </p>
          </div>
{/* Newsletter illustration */}
          <div className="relative flex items-center justify-center">
            <Image
              src={waterMark}
              alt="Newsletter illustration"
              width={500}
              height={500}
              className="h-auto w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;