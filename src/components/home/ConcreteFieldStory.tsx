"use client";

import player1 from "@/assets/p1.png";
import player2 from "@/assets/p2.png";
import player3 from "@/assets/p3.png";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const playerImages = [player1, player2, player3];

// Add a caption for each player image (same order as playerImages)
const playerCaptions = [
  "Learned on Egyptian dirt lots",
  "Sharpened on Brazilian sand",
  "Forged on DFW concrete",
];

const features = [
  {
    id: "raw-talent",
    title: "Raw Talent",
    description: "Developing individual brilliance in tight spaces.",
  },
  {
    id: "street-grit",
    title: "Street Grit",
    description: "The resilience found only on the concrete courts.",
  },
];

const ConcreteFieldStory = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = useMemo(() => playerImages.length, []);
  const canNavigate = totalImages > 1;

  // Autoplay: move to next image every 4 seconds
  useEffect(() => {
    if (!canNavigate) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 4000);
    return () => clearInterval(interval);
  }, [canNavigate, totalImages]);

  return (
    <section className="w-full relative py-10 md:py-16 lg:py-24 overflow-hidden">
      {/* Background with soccer field pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-90"
        style={{
          backgroundImage: "url('/images/bgball.png')",
        }}
      />

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right - Player Card (appears first on mobile) */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div
              className="bg-gray-100 rounded-lg overflow-hidden shadow-2xl max-w-xs sm:max-w-sm lg:max-w-md w-full relative"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Player Image Carousel */}
              <div className="absolute inset-0 w-full overflow-hidden bg-gray-300">
                {/* Images with smooth transition */}
                {playerImages.map((image, index) => (
                  <div
                    key={image.src}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Soccer player ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 90vw, 32rem"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover object-top"
                    />

                    {/* Transparent shadow overlay with caption text */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end px-4 py-3 pointer-events-none">
                      <p className="text-[#ccff00] text-sm md:text-base font-medium">
                        {playerCaptions[index]}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Image Indicators (placed above the caption text) */}
                <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                  {playerImages.map((image, index) => (
                    <button
                      type="button"
                      key={image.src}
                      onClick={() => {
                        setCurrentImageIndex(index);
                      }}
                      data-active={index === currentImageIndex}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex
                          ? "bg-[#ccff00]"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Left Content (appears second on mobile) */}
          <div className="order-2 lg:order-1">
            <h2
              className={`font-oswald mb-4 text-4xl sm:text-5xl lg:text-[72px] leading-[1.2] font-bold`}
            >
              The concrete field story
            </h2>
            <p
              className="text-[16px] mb-8"
              style={{
                color: "var(--Text-2nd, #E3E3E3)",
                fontFamily: "Open Sans",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              Our street soccer philosophy focuses on technical mastery, grit,
              and the raw energy of the asphalt. Born on the streets, perfected
              on the pitch. Every touch matters when space is a luxury.
            </p>

            {/* Feature Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-transparent backdrop-blur-sm border-l-4 border-[#ccff00] border p-5 rounded"
                >
                  <h3 className="text-white text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcreteFieldStory;
