import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verly Optical — Affordable Prescription Glasses Online",
  description:
    "Shop affordable prescription glasses, blue light glasses, progressive lenses, and photochromic lenses. Complete pairs from $28. Free shipping on all orders.",
  keywords: [
    "affordable prescription glasses",
    "blue light glasses",
    "progressive glasses online",
    "photochromic lenses",
    "bifocal glasses",
    "men's glasses",
    "women's glasses",
    "prescription eyeglasses",
  ],
  openGraph: {
    title: "Verly Optical — Affordable Prescription Glasses",
    description: "Complete prescription glasses from $28. Blue light, progressive, photochromic & more.",
    url: "https://verlyoptical.com",
    siteName: "Verly Optical",
    images: [{ url: "/hero-man.jpg", width: 1200, height: 630, alt: "Verly Optical eyeglasses" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verly Optical — Affordable Prescription Glasses",
    description: "Complete prescription glasses from $28.",
    images: ["/hero-man.jpg"],
  },
  alternates: { canonical: "https://verlyoptical.com" },
};

const collections = [
  {
    title: "Blue Light Glasses",
    desc: "Protect your eyes during long screen hours. Essential AR coating blocks up to 40% of harmful blue light.",
    href: "/blue-light-glasses",
    tag: "Most popular",
  },
  {
    title: "Progressive Lenses",
    desc: "See clearly at every distance — near, intermediate, and far — with no visible line on the lens.",
    href: "/progressive-glasses",
    tag: "Best for 40+",
  },
  {
    title: "Photochromic Lenses",
    desc: "Lenses that automatically darken in sunlight and clear indoors. One pair for every environment.",
    href: "/photochromic-glasses",
    tag: "Outdoor life",
  },
  {
    title: "Bifocal Glasses",
    desc: "Classic dual-focus lenses offering sharp near and distance vision in one affordable frame.",
    href: "/bifocal-glasses",
    tag: "Classic choice",
  },
  {
    title: "Men's Glasses",
    desc: "From minimal wire frames to bold acetate — prescription eyeglasses built for everyday wear.",
    href: "/mens-glasses",
    tag: "New styles",
  },
  {
    title: "Women's Glasses",
    desc: "Timeless shapes and editorial silhouettes. Prescription-ready with your choice of lens treatment.",
    href: "/womens-glasses",
    tag: "New styles",
  },
];

const features = [
  { icon: "◎", label: "Free shipping", desc: "On every order, always" },
  { icon: "◈", label: "From $28 complete", desc: "Frame + single vision lenses" },
  { icon: "◉", label: "90-day returns", desc: "Hassle-free guarantee" },
  { icon: "◌", label: "Prescription verified", desc: "By licensed opticians" },
];

export default function HomePage() {
  return (
    <main>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "92vh", minHeight: 520 }}>
        <Image
          src="/hero-man.jpg"
          alt="Man wearing Verly Optical prescription glasses"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/60 via-[#1C1C1A]/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-16 max-w-7xl mx-auto left-0 right-0">
          <p
            className="text-[11px] tracking-[0.22em] uppercase text-[#EDE8DF]/70 mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Prescription eyewear
          </p>
          <h1
            className="text-[48px] md:text-[72px] lg:text-[88px] text-[#F7F4EF] leading-[0.95] font-light max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            See the world<br />
            <em>clearly.</em>
          </h1>
          <p
            className="mt-5 text-[15px] md:text-[17px] text-[#EDE8DF]/80 max-w-sm leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Affordable prescription glasses, blue light lenses & progressive eyewear. Complete pairs from $28.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/Tienda"
              className="px-7 py-3.5 text-[12px] tracking-[0.12em] uppercase text-[#F7F4EF] bg-[#4A5940] hover:bg-[#3d4c34] transition-colors rounded-sm"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Shop all frames
            </Link>
            <Link
              href="/blue-light-glasses"
              className="px-7 py-3.5 text-[12px] tracking-[0.12em] uppercase text-[#F7F4EF] border border-[#F7F4EF]/40 hover:border-[#F7F4EF]/80 transition-colors rounded-sm"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Blue light glasses
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ────────────────────────────────────── */}
      <section className="bg-[#4A5940] py-5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-[20px] text-[#EDE8DF]/50">{f.icon}</span>
              <div>
                <p
                  className="text-[12px] text-[#F7F4EF] font-medium tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {f.label}
                </p>
                <p
                  className="text-[11px] text-[#EDE8DF]/60"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY NEED ────────────────────────────────────── */}
      <section className="bg-[#F7F4EF] py-20 px-6" aria-labelledby="collections-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p
                className="text-[10px] tracking-[0.22em] uppercase text-[#8C8680] mb-3"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Collections
              </p>
              <h2
                id="collections-heading"
                className="text-[36px] md:text-[48px] text-[#1C1C1A] leading-tight font-light"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Shop by lens type
              </h2>
            </div>
            <Link
              href="/Tienda"
              className="hidden md:flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[#4A5940] hover:text-[#1C1C1A] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              All frames
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M1 5h14M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col) => (
              <Link
                key={col.href}
                href={col.href}
                className="group relative flex flex-col justify-between p-6 md:p-7 bg-[#EDE8DF] hover:bg-[#E4DED5] transition-all duration-300 rounded-sm min-h-[180px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="text-[20px] md:text-[22px] text-[#1C1C1A] leading-tight font-light group-hover:text-[#4A5940] transition-colors"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {col.title}
                  </h3>
                  <span
                    className="flex-shrink-0 text-[10px] tracking-[0.1em] uppercase text-[#4A5940] bg-[#4A5940]/10 px-2 py-1 rounded-full"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {col.tag}
                  </span>
                </div>
                <div>
                  <p
                    className="text-[13px] text-[#8C8680] leading-relaxed mt-3 mb-5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {col.desc}
                  </p>
                  <span
                    className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#4A5940] group-hover:gap-3 transition-all duration-200"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Shop now
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                      <path d="M1 4h12M9 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO COPY SECTION ─────────────────────────────────── */}
      <section className="bg-[#EDE8DF] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2
                className="text-[28px] md:text-[34px] text-[#1C1C1A] leading-tight font-light mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Affordable prescription glasses — without compromise
              </h2>
              <p
                className="text-[14px] text-[#8C8680] leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                At Verly Optical, every pair of prescription eyeglasses starts at just $28 — frame and lenses included. We believe that quality vision care shouldn't require a premium price tag.
              </p>
              <p
                className="text-[14px] text-[#8C8680] leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Whether you need <Link href="/blue-light-glasses" className="text-[#4A5940] underline underline-offset-2">blue light glasses</Link> for daily screen use, <Link href="/progressive-glasses" className="text-[#4A5940] underline underline-offset-2">progressive lenses</Link> for all-distance clarity, or classic <Link href="/bifocal-glasses" className="text-[#4A5940] underline underline-offset-2">bifocal glasses</Link> — our licensed opticians verify every prescription before your order ships.
              </p>
              <Link
                href="/Tienda"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[#4A5940] font-medium hover:text-[#1C1C1A] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Browse all frames →
              </Link>
            </div>

            <div>
              <h2
                className="text-[28px] md:text-[34px] text-[#1C1C1A] leading-tight font-light mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                The right lens for your lifestyle
              </h2>
              <p
                className="text-[14px] text-[#8C8680] leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Not all lenses are the same. <Link href="/photochromic-glasses" className="text-[#4A5940] underline underline-offset-2">Photochromic lenses</Link> automatically adapt to changing light — perfect for people who move between indoors and outdoors throughout the day.
              </p>
              <p
                className="text-[14px] text-[#8C8680] leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                For <Link href="/mens-glasses" className="text-[#4A5940] underline underline-offset-2">men's glasses</Link> and <Link href="/womens-glasses" className="text-[#4A5940] underline underline-offset-2">women's glasses</Link> alike, our configurator walks you through every lens option — material, coating, and filter — so you build exactly what you need.
              </p>
              <Link
                href="/lenses"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[#4A5940] font-medium hover:text-[#1C1C1A] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Learn about lenses →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="bg-[#1C1C1A] py-24 px-6 text-center">
        <p
          className="text-[10px] tracking-[0.22em] uppercase text-[#8C8680] mb-5"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Complete pair from $28
        </p>
        <h2
          className="text-[40px] md:text-[60px] text-[#F7F4EF] leading-tight font-light mb-6 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Ready to see better?
        </h2>
        <p
          className="text-[15px] text-[#8C8680] mb-10 max-w-md mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Upload your prescription or start with your frame — our configurator does the rest.
        </p>
        <Link
          href="/Tienda"
          className="inline-block px-10 py-4 text-[12px] tracking-[0.14em] uppercase text-[#1C1C1A] bg-[#F7F4EF] hover:bg-[#EDE8DF] transition-colors rounded-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Find your frames
        </Link>
      </section>

    </main>
  );
}