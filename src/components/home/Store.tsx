"use client";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

/* ────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────── */
export type StoreImage = StaticImageData | string;

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  image: StoreImage;
  alt?: string;
  badge?: string;
  rating?: number;
  href?: string;
}

export interface StoreTile {
  image: StoreImage;
  alt?: string;
  className?: string;
}

/* ────────────────────────────────────────────────────────────
   Demo data (swap with @/assets imports or API data later)
──────────────────────────────────────────────────────────── */
const tileUrl = (n: number) =>
  `https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-0${n}.jpg`;

export const heroTiles: StoreTile[][] = [
  [{ image: tileUrl(1), className: "hidden lg:block" }, { image: tileUrl(2) }],
  [{ image: tileUrl(3) }, { image: tileUrl(4) }, { image: tileUrl(5) }],
  [{ image: tileUrl(6) }, { image: tileUrl(7) }],
];

export const storeProducts: StoreProduct[] = [
  {
    id: "team-jersey",
    name: "Team Jersey",
    category: "Apparel",
    price: 49.99,
    compareAtPrice: 59.99,
    image: tileUrl(1),
    badge: "New",
    rating: 4.8,
  },
  {
    id: "training-top",
    name: "Training Top",
    category: "Apparel",
    price: 39.99,
    image: tileUrl(2),
    rating: 4.6,
  },
  {
    id: "match-kit",
    name: "Match Kit",
    category: "Kits",
    price: 89.99,
    image: tileUrl(3),
    badge: "Sale",
    rating: 4.9,
  },
  {
    id: "sport-shorts",
    name: "Sport Shorts",
    category: "Apparel",
    price: 29.99,
    image: tileUrl(4),
    rating: 4.4,
  },
  {
    id: "warm-up-set",
    name: "Warm-Up Set",
    category: "Kits",
    price: 59.99,
    compareAtPrice: 74.99,
    image: tileUrl(5),
    rating: 4.7,
  },
  {
    id: "travel-bag",
    name: "Travel Bag",
    category: "Accessories",
    price: 44.99,
    image: tileUrl(6),
    badge: "New",
    rating: 4.5,
  },
];

/* ────────────────────────────────────────────────────────────
   Reusable hero tiles / collage
──────────────────────────────────────────────────────────── */
export function HeroTile({ image, alt = "", className = "" }: StoreTile) {
  return (
    <div
      className={`h-60 w-40 overflow-hidden rounded-lg bg-[#1A2230] sm:h-64 sm:w-44 ${className}`}
    >
      <Image
        src={image}
        alt={alt}
        width={176}
        height={256}
        quality={80}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function HeroCollage({ tiles = heroTiles }: { tiles?: StoreTile[][] }) {
  return (
    <div className="flex items-center justify-center gap-5 sm:gap-6 lg:gap-8">
      {tiles.map((column, colIndex) => (
        <div key={colIndex} className="flex shrink-0 flex-col gap-y-6 lg:gap-y-8">
          {column.map((tile, tileIndex) => (
            <HeroTile key={`${colIndex}-${tileIndex}`} {...tile} />
          ))}
        </div>
      ))}
    </div>
  );
}
/* ────────────────────────────────────────────────────────────
   Reusable product card + skeleton
──────────────────────────────────────────────────────────── */
export function ProductCard({ product }: { product: StoreProduct }) {
  const card = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2A3140] bg-[#0F131B] transition-all duration-300 hover:-translate-y-1 hover:border-[#CCFF00]/70 hover:shadow-[0_16px_45px_-30px_rgba(204,255,0,0.45)]">
      <div className="relative aspect-square overflow-hidden bg-[#1A2230]">
        <Image
          src={product.image}
          alt={product.alt ?? product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#CCFF00] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span
          className="text-[11px] uppercase tracking-wider text-gray-400"
          style={{ fontFamily: "Open Sans" }}
        >
          {product.category}
        </span>
        <h3 className="font-oswald mt-1 text-lg font-semibold text-white">
          {product.name}
        </h3>

        {product.rating != null && (
          <div className="mt-1.5 flex items-center gap-1 text-[#CCFF00]">
            <Star size={14} fill="currentColor" />
            <span className="text-xs text-gray-300">{product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#CCFF00]">
            Coming Soon
          </span>
        </div>
      </div>
    </article>
  );

  return product.href ? <Link href={product.href}>{card}</Link> : card;
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#2A3140] bg-[#0F131B]">
      <div className="aspect-square w-full bg-[#1A2230]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-[#1A2230]" />
        <div className="h-5 w-2/3 rounded bg-[#1A2230]" />
        <div className="mt-1 h-6 w-24 rounded-full bg-[#1A2230]" />
      </div>
    </div>
  );
}
/* ────────────────────────────────────────────────────────────
   Reusable store section
──────────────────────────────────────────────────────────── */
interface StoreSectionProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  heroTilesList?: StoreTile[][];
  products?: StoreProduct[];
  maxProducts?: number;
  ctaLabel?: string;
  ctaHref?: string;
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function StoreSection({
  kicker = "The Proving Ground Store",
  title = "Gear Up. Play Proud.",
  subtitle =
    "Rep the crest with kit built to perform. Match jerseys, training gear and travel essentials for players who show up and stay ready.",
  heroTilesList = heroTiles,
  products = storeProducts,
  maxProducts = 3,
  ctaLabel = "Shop Collection",
  ctaHref = "#",
  columns = 3,
  isLoading = false,
  skeletonCount = 3,
  className = "",
}: StoreSectionProps) {
  const columnsClass =
    columns === 2
      ? "sm:grid-cols-2 lg:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  // When no real store page is available yet, the CTA shows a short
  // "Coming Soon" toast that auto-dismisses after 2 seconds.
  const hasRealLink = Boolean(ctaHref && ctaHref !== "#");
  const handleCtaClick = () => toast("Coming Soon", { duration: 2000 });

  const ctaButtonClass =
    "inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#CCFF00] px-7 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-[#B8E600] sm:w-auto sm:text-base";

  return (
    <section
      className={`relative w-full overflow-hidden bg-black py-8 lg:py-6 ${className}`}
    >
      <div className="text-center mb-4 lg:mb-8">
        <h2 className="text-[#F5F5F5] font-['Oswald'] text-[36px] sm:text-[44px] md:text-[56px] font-extrabold leading-[120%]">
          Get Ready for <span className="text-[#CCFF00]">Gameday</span>.
        </h2>
        <div className="bg-[#CCFF00] w-24 h-1 mx-auto my-3 rounded-lg" />
        <p className="text-gray-300 text-lg">
          Official kit, match-ready equipment, and everyday essentials for the
          whole team.
        </p>
      </div>
      <div className="mx-auto px-4 lg:px-17.25">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/45 bg-[#CCFF00]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#CCFF00]">
              <ShoppingBag size={14} />
              {kicker}
            </span>
            <h2 className="font-oswald mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h2>
            {subtitle && (
              <p
                className="mt-5 max-w-xl text-base leading-relaxed text-[#E3E3E3] sm:text-lg"
                style={{ fontFamily: "Open Sans" }}
              >
                {subtitle}
              </p>
            )}
            <div className="mt-6 h-1 w-24 rounded bg-[#CCFF00]" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {hasRealLink ? (
                <Link href={ctaHref as string} className="w-full sm:w-auto">
                  <button type="button" className={ctaButtonClass}>
                    {ctaLabel}
                    <ArrowRight size={18} />
                  </button>
                </Link>
              ) : (
                <button type="button" onClick={handleCtaClick} className={ctaButtonClass}>
                  {ctaLabel}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          <HeroCollage tiles={heroTilesList} />
        </div>

        <div className="mt-20 sm:mt-24">
          <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h3 className="font-oswald text-2xl font-semibold text-white sm:text-3xl">
                Best Sellers
              </h3>
              <div className="mt-3 h-1 w-16 rounded bg-[#CCFF00]" />
            </div>
            {hasRealLink ? (
              <Link
                href={ctaHref as string}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#CCFF00] transition hover:text-[#B8E600]"
              >
                View all <ArrowRight size={16} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleCtaClick}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#CCFF00] transition hover:text-[#B8E600]"
              >
                View all <ArrowRight size={16} />
              </button>
            )}
          </div>

          <div className={`grid grid-cols-1 gap-5 sm:gap-6 ${columnsClass}`}>
            {isLoading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products.slice(0, maxProducts).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const Store = () => <StoreSection />;

export default Store;