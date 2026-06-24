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

const navLinks = [
  { href: "/Tienda", label_es: "Armazones", label_en: "Frames" },
  { href: "/lenses", label_es: "Lentes", label_en: "Lenses" },
  { href: "/examen", label_es: "Examen de la Vista", label_en: "Eye Exam" },
  { href: "/blog", label_es: "Blog", label_en: "Blog" },
  { href: "/nosotros", label_es: "Sobre Nosotros", label_en: "About Us" },
  { href: "/ubicaciones", label_es: "Ubicaciones", label_en: "Locations" },
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
        background: "white",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 2px 16px rgba(27,58,107,0.06)",
      }}>
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
                  fontSize: "0.7rem",
                  fontWeight: isActive(href) ? 600 : 400,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
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
                  height: "2px",
                  background: "var(--accent)",
                  transform: isActive(href) ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease",
                }}/>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
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
        background: "white",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "3rem 2.5rem",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "all" : "none",
        transition: "opacity 0.35s ease",
      }}>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {navLinks.map(({ href, label_es, label_en }, i) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 7vw, 2.5rem)",
                fontWeight: 300,
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
          Grupo Óptico del Noroeste — Est. 2012
        </p>
      </div>

      <style jsx global>{`
        .nav-link:hover .nav-underline { transform: scaleX(1) !important; }
        .nav-link:hover { color: var(--sage) !important; }
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