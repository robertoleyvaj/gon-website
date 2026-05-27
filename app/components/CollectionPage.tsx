import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface CollectionPageProps {
  title: string;
  subtitle: string;
  description: string;
  heroKeyword: string; // used in H1 for SEO
  lensHighlights: { icon: string; label: string; desc: string }[];
  faq: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
  filterTag?: string; // matches tag in Supabase armazones table
}

async function getFrames(filterTag?: string) {
  let query = supabase
    .from("armazones")
    .select("id, nombre, precio, imagen_url, tags, genero")
    .eq("activo", true)
    .limit(8);

  if (filterTag) {
    query = query.contains("tags", [filterTag]);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function CollectionPage({
  title,
  subtitle,
  description,
  heroKeyword,
  lensHighlights,
  faq,
  relatedLinks,
  filterTag,
}: CollectionPageProps) {
  const frames = await getFrames(filterTag);

  return (
    <main className="bg-[#F7F4EF] min-h-screen">

      {/* ── HERO EDITORIAL ─────────────────────────────────── */}
      <section className="relative bg-[#1C1C1A] overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #F7F4EF 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#4A5940]" />
              <p
                className="text-[10px] tracking-[0.22em] uppercase text-[#6B7A5E]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {subtitle}
              </p>
            </div>

            <h1
              className="text-[52px] md:text-[72px] lg:text-[84px] text-[#F7F4EF] leading-[0.92] font-light"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {heroKeyword}
            </h1>

            <p
              className="mt-6 text-[15px] md:text-[16px] text-[#8C8680] leading-relaxed max-w-xl"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link
                href="/Tienda"
                className="px-7 py-3.5 text-[12px] tracking-[0.12em] uppercase text-[#F7F4EF] bg-[#4A5940] hover:bg-[#3d4c34] transition-colors rounded-sm"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Shop all frames
              </Link>
              <span
                className="text-[13px] text-[#8C8680]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Complete pairs from{" "}
                <strong className="text-[#F7F4EF]">$28</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="h-px bg-gradient-to-r from-[#4A5940] via-[#4A5940]/30 to-transparent" />
      </section>

      {/* ── LENS HIGHLIGHTS ───────────────────────────────── */}
      <section className="bg-[#EDE8DF] border-b border-[#E2DDD6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {lensHighlights.map((h) => (
            <div key={h.label} className="flex flex-col gap-2">
              <span className="text-[22px] text-[#4A5940]">{h.icon}</span>
              <p
                className="text-[13px] text-[#1C1C1A] font-medium"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {h.label}
              </p>
              <p
                className="text-[12px] text-[#8C8680] leading-snug"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FRAMES GRID ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase text-[#8C8680] mb-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Featured frames
            </p>
            <h2
              className="text-[28px] md:text-[36px] text-[#1C1C1A] font-light leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {frames.length > 0 ? `${frames.length} styles available` : "All frames"}
            </h2>
          </div>
          <Link
            href="/Tienda"
            className="hidden md:flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[#4A5940] hover:text-[#1C1C1A] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            View all
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 5h14M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {frames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {frames.map((frame: any) => (
              <Link
                key={frame.id}
                href={`/armazon/${frame.id}`}
                className="group"
              >
                <div className="relative aspect-square bg-[#EDE8DF] rounded-sm overflow-hidden mb-3">
                  {frame.imagen_url ? (
                    <Image
                      src={frame.imagen_url}
                      alt={`${frame.nombre} prescription glasses`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="48" height="28" viewBox="0 0 48 28" fill="none" className="opacity-20">
                        <rect x="1" y="1" width="18" height="26" rx="9" stroke="#1C1C1A" strokeWidth="2" />
                        <rect x="29" y="1" width="18" height="26" rx="9" stroke="#1C1C1A" strokeWidth="2" />
                        <path d="M19 14h10" stroke="#1C1C1A" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#1C1C1A]/0 group-hover:bg-[#1C1C1A]/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <span
                      className="text-[11px] tracking-[0.1em] uppercase text-[#F7F4EF] bg-[#4A5940] px-3 py-1.5 rounded-sm"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      Configure
                    </span>
                  </div>
                </div>

                <div className="px-0.5">
                  <p
                    className="text-[15px] text-[#1C1C1A] group-hover:text-[#4A5940] transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {frame.nombre}
                  </p>
                  <p
                    className="text-[12px] text-[#8C8680] mt-1"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    From ${(13 + 15).toFixed(0)} complete
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty state — mostramos CTA hacia tienda */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Link key={i} href="/Tienda" className="group">
                <div className="relative aspect-square bg-[#EDE8DF] rounded-sm overflow-hidden mb-3 flex items-center justify-center">
                  <svg width="48" height="28" viewBox="0 0 48 28" fill="none" className="opacity-20">
                    <rect x="1" y="1" width="18" height="26" rx="9" stroke="#1C1C1A" strokeWidth="2" />
                    <rect x="29" y="1" width="18" height="26" rx="9" stroke="#1C1C1A" strokeWidth="2" />
                    <path d="M19 14h10" stroke="#1C1C1A" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p
                  className="text-[15px] text-[#1C1C1A] group-hover:text-[#4A5940] transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Browse styles
                </p>
                <p
                  className="text-[12px] text-[#8C8680] mt-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  From $28 complete
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/Tienda"
            className="inline-block px-8 py-3 text-[12px] tracking-[0.1em] uppercase text-[#F7F4EF] bg-[#4A5940] hover:bg-[#3d4c34] transition-colors rounded-sm"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            View all frames
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="bg-[#EDE8DF] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-[10px] tracking-[0.2em] uppercase text-[#8C8680] mb-3 text-center"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Simple process
          </p>
          <h2
            className="text-[30px] md:text-[38px] text-[#1C1C1A] font-light text-center mb-12 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            From frame to your door
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose your frame", desc: "Browse our collection and pick the shape that suits you." },
              { step: "02", title: "Configure your lenses", desc: "Select your vision type, material, and any coatings or filters." },
              { step: "03", title: "Send your prescription", desc: "Upload it at checkout or email it to us. Our opticians verify everything." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col">
                <span
                  className="text-[13px] text-[#4A5940] tracking-[0.15em] mb-3"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {s.step}
                </span>
                <div className="h-px bg-[#E2DDD6] mb-5" />
                <h3
                  className="text-[18px] text-[#1C1C1A] font-light mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[13px] text-[#8C8680] leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      {faq.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 md:px-12 py-16">
          <p
            className="text-[10px] tracking-[0.2em] uppercase text-[#8C8680] mb-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Questions
          </p>
          <h2
            className="text-[28px] md:text-[36px] text-[#1C1C1A] font-light mb-10 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Frequently asked
          </h2>
          <div className="divide-y divide-[#E2DDD6]">
            {faq.map((item) => (
              <details key={item.q} className="group py-5 cursor-pointer list-none">
                <summary className="flex items-center justify-between gap-4 list-none marker:hidden [&::-webkit-details-marker]:hidden">
                  <span
                    className="text-[15px] md:text-[16px] text-[#1C1C1A] group-open:text-[#4A5940] transition-colors"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {item.q}
                  </span>
                  <svg
                    className="flex-shrink-0 w-4 h-4 text-[#8C8680] group-open:rotate-45 transition-transform duration-200"
                    viewBox="0 0 16 16" fill="none"
                  >
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </summary>
                <p
                  className="mt-3 text-[13px] text-[#8C8680] leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── RELATED COLLECTIONS ───────────────────────────── */}
      <section className="bg-[#EDE8DF] border-t border-[#E2DDD6] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-[10px] tracking-[0.2em] uppercase text-[#8C8680] mb-6 text-center"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Also explore
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-5 py-2.5 text-[12px] tracking-[0.08em] uppercase text-[#1C1C1A] border border-[#E2DDD6] hover:border-[#4A5940] hover:text-[#4A5940] bg-[#F7F4EF] transition-colors rounded-sm"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────── */}
      <section className="bg-[#4A5940] py-16 px-6 text-center">
        <h2
          className="text-[32px] md:text-[44px] text-[#F7F4EF] font-light mb-4 leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Complete pair from $28
        </h2>
        <p
          className="text-[14px] text-[#EDE8DF]/70 mb-8 max-w-sm mx-auto"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Frame + lenses included. No hidden fees. Prescription verified by our opticians.
        </p>
        <Link
          href="/Tienda"
          className="inline-block px-9 py-4 text-[12px] tracking-[0.14em] uppercase text-[#4A5940] bg-[#F7F4EF] hover:bg-[#EDE8DF] transition-colors rounded-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Find your frames
        </Link>
      </section>

    </main>
  );
}