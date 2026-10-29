// app/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./LanguageContext";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";
import CartDrawer from "./CartDrawer";
import FavoritosDrawer from "./FavoritosDrawer";
import { waGon } from "../lib/precio-gon";

function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {(["es", "en"] as const).map((l, i) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: "0.62rem",
            fontWeight: lang === l ? 600 : 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: lang === l ? "var(--sage)" : "var(--warm-gray)",
            padding: "4px 5px",
            transition: "color 0.2s ease",
            borderBottom: lang === l ? "1px solid var(--sage)" : "1px solid transparent",
            borderRight: i === 0 ? "1px solid var(--border)" : "none",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function FavoritosIcon() {
  const { totalFavoritos, setFavoritosOpen } = useFavoritos();
  return (
    <button
      onClick={() => setFavoritosOpen(true)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--charcoal)",
        transition: "color 0.2s ease",
      }}
      aria-label="Favoritos"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={totalFavoritos > 0 ? "var(--sage)" : "none"}
        stroke={totalFavoritos > 0 ? "var(--sage)" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {totalFavoritos > 0 && (
        <span style={{
          position: "absolute", top: "-1px", right: "-1px",
          background: "var(--sage)", color: "white", borderRadius: "50%",
          width: "14px", height: "14px", fontSize: "8px", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-sans)",
        }}>
          {totalFavoritos > 9 ? "9+" : totalFavoritos}
        </span>
      )}
    </button>
  );
}

function CartIcon() {
  const { totalItems, setCartOpen } = useCart();
  return (
    <button
      onClick={() => setCartOpen(true)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--charcoal)",
        transition: "color 0.2s ease",
      }}
      aria-label="Carrito"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {totalItems > 0 && (
        <span style={{
          position: "absolute", top: "-1px", right: "-1px",
          background: "var(--sage)", color: "white", borderRadius: "50%",
          width: "14px", height: "14px", fontSize: "8px", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-sans)",
        }}>
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

// Menú de computadora: igual que Verly (pocas ligas) + el botón propio de GON "Agenda tu examen".
// Micas y Blog siguen existiendo (pie de página y menú del celular) para SEO.
const navLinks = [
  { href: "/Tienda", label_es: "Armazones", label_en: "Frames" },
  { href: "/nosotros", label_es: "Quiénes somos", label_en: "About us" },
  { href: "/ubicaciones", label_es: "Ubicaciones", label_en: "Locations" },
];
const navMovil = [
  ...navLinks,
  { href: "/examen", label_es: "Agenda tu examen", label_en: "Book your eye exam" },
  { href: "/lenses", label_es: "Micas", label_en: "Lenses" },
  { href: "/blog", label_es: "Blog", label_en: "Blog" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang } = useLang();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <CartDrawer />
      <FavoritosDrawer />

      {/* ── Header ── */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: "var(--cream)",
        boxShadow: "0 1px 0 var(--border)",
      }}>
        {/* Banda de precio web: lleva a WhatsApp y ahí recibe su código (WhatsAppCodigo) */}
        <a className="gon-banda" href={waGon(lang === 'es' ? '¡Hola GON! 👋 Quiero mi código de precio web 🎟️' : 'Hi GON! 👋 I want my online price code 🎟️')} target="_blank" rel="noopener noreferrer">
          <span className="gb-c"><b>{lang === 'es' ? 'Compra en línea y paga hasta 60% menos en tus lentes.' : 'Shop online and pay up to 60% less on your glasses.'}</b> {lang === 'es' ? 'Pide tu código web →' : 'Get your web code →'}</span>
          <span className="gb-m"><b>{lang === 'es' ? 'Hasta 60% menos en línea' : 'Up to 60% off online'}</b> · {lang === 'es' ? 'Pide tu código →' : 'Get your code →'}</span>
        </a>
        <style>{`
          body{padding-top:30px}
          .gon-banda{display:flex;align-items:center;justify-content:center;height:30px;padding:0 12px;background:var(--sage);color:#fff;text-decoration:none;font-size:12.5px;font-family:var(--font-sans);white-space:nowrap;overflow:hidden}
          .gon-banda b{font-weight:600}
          .gon-banda .gb-m{display:none}
          @media (max-width:720px){.gon-banda{font-size:11.5px}.gon-banda .gb-c{display:none}.gon-banda .gb-m{display:inline}}
        `}</style>
        <div style={{
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
            <img
              src="/logo-gon.png"
              alt="GON — Grupo Óptico del Noroeste"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}>
            {navLinks.map(({ href, label_es, label_en }) => (
              <Link
                key={href}
                href={href}
                className="nav-link"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  fontWeight: isActive(href) ? 500 : 400,
                  letterSpacing: "0.01em",
                  color: isActive(href) ? "var(--sage)" : "var(--charcoal)",
                  textDecoration: "none",
                  position: "relative",
                  paddingBottom: "3px",
                  transition: "color 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {lang === "en" ? label_en : label_es}
                <span className="nav-underline" style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  height: "1px",
                  background: "var(--sage)",
                  transform: isActive(href) ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease",
                }}/>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            <Link href="/examen" className="desktop-nav nav-cta">
              {lang === "en" ? "Book your free eye exam" : "Agenda tu examen de la vista"}
            </Link>
            <LangSwitcher />
            <FavoritosIcon />
            <CartIcon />

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
              aria-expanded={menuOpen}
              className="hamburger"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 4px", display: "flex", flexDirection: "column",
                gap: "5px", alignItems: "flex-end",
              }}
            >
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--charcoal)", transition: "transform 0.3s ease, opacity 0.3s ease", transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}/>
              <span style={{ display: "block", width: "15px", height: "1.5px", background: "var(--charcoal)", transition: "opacity 0.3s ease", opacity: menuOpen ? 0 : 1 }}/>
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--charcoal)", transition: "transform 0.3s ease, opacity 0.3s ease", transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}/>
            </button>
          </div>
        </div>
      </header>

      {/* ── Menú móvil ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 99,
        background: "var(--cream)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "3rem 2.5rem",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "all" : "none",
        transition: "opacity 0.35s ease",
      }}>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {navMovil.map(({ href, label_es, label_en }, i) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 7vw, 2.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: isActive(href) ? "var(--sage)" : "var(--charcoal)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border)",
                padding: "1rem 0",
                letterSpacing: "-0.02em",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.45s ease ${i * 0.07 + 0.1}s, transform 0.45s ease ${i * 0.07 + 0.1}s`,
              }}
            >
              {lang === "en" ? label_en : label_es}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "2rem", opacity: menuOpen ? 1 : 0, transition: "opacity 0.4s ease 0.4s" }}>
          <LangSwitcher />
        </div>
        <p style={{
          position: "absolute", bottom: "2.5rem", left: "2.5rem",
          fontFamily: "var(--font-sans)", fontSize: "0.62rem",
          letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--warm-gray)",
        }}>
          Grupo Óptico del Noroeste
        </p>
      </div>

      <style jsx global>{`
        .nav-link:hover .nav-underline { transform: scaleX(1) !important; }
        .nav-link:hover { color: var(--sage) !important; }
        .nav-cta { align-items:center; background: var(--sage); color: #fff !important; text-decoration: none; font-family: var(--font-sans); font-size: 0.8rem; font-weight: 500; padding: 10px 18px; border-radius: 999px; white-space: nowrap; transition: background .2s; }
        .nav-cta:hover { background: var(--sage-light); }
        @media (min-width: 900px) {
          .hamburger { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}