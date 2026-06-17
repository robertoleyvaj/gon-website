"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// ── Caché de precios de Supabase ─────────────────────────────────────────────
let cachePrecios: any = null;
let cachePreciosTime = 0;

export function invalidarCachePrecios() {
  cachePrecios = null;
  cachePreciosTime = 0;
}

// ── Tipo de cambio USD → MXN ─────────────────────────────────────────────────
const CACHE_TC_KEY = "gon_tipo_cambio";
const CACHE_TC_TTL = 24 * 60 * 60 * 1000; // 24 horas

async function obtenerTipoCambio(): Promise<number> {
  try {
    // Revisar caché en localStorage
    const cached = localStorage.getItem(CACHE_TC_KEY);
    if (cached) {
      const { valor, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TC_TTL) {
        return valor;
      }
    }

    // Consultar API (gratuita, actualización diaria)
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    const tc = data?.rates?.MXN;

    if (tc && tc > 0) {
      localStorage.setItem(CACHE_TC_KEY, JSON.stringify({ valor: tc, timestamp: Date.now() }));
      return tc;
    }
  } catch (e) {
    console.warn("No se pudo obtener el tipo de cambio, usando valor por defecto:", e);
  }

  // Fallback si falla la API
  return 17.5;
}

// ── Conversión y redondeo ────────────────────────────────────────────────────
// Convierte USD a MXN y redondea al múltiplo de 10 más cercano hacia arriba
// Ej: 15 USD × 17.23 = 258.45 → 260 MXN
export function redondearMXN(precioDlls: number, tipoCambio: number): number {
  const mxn = precioDlls * tipoCambio;
  return Math.ceil(mxn / 10) * 10;
}

// ── Hook principal ───────────────────────────────────────────────────────────
export function usePrecios() {
  const [precios, setPrecios] = useState<any>({
    armazon_base: 0,
    vision: [],
    material: [],
    filtro: [],
  });
  const [tipoCambio, setTipoCambio] = useState<number>(17.5);

  useEffect(() => {
    // Cargar tipo de cambio
    obtenerTipoCambio().then(setTipoCambio);

    // Cargar precios desde Supabase
    async function cargarPrecios() {
      const ahora = Date.now();

      if (cachePrecios && ahora - cachePreciosTime < 5 * 60 * 1000) {
        setPrecios(cachePrecios);
        return;
      }

      const { data, error } = await supabase
        .from("precios")
        .select("*")
        .eq("activo", true)
        .order("orden");

      if (error || !data) {
        console.error("Error cargando precios:", error);
        return;
      }

      const resultado: any = {
        armazon_base: 0,
        vision: [],
        material: [],
        filtro: [],
      };

      data.forEach((p: any) => {
        if (p.categoria === "armazon") {
          resultado.armazon_base = Number(p.precio || 0);
        }
        if (p.categoria === "vision") {
          resultado.vision.push({ ...p, precio: Number(p.precio || 0) });
        }
        if (p.categoria === "material") {
          resultado.material.push({ ...p, precio: Number(p.precio || 0) });
        }
        if (p.categoria === "filtro") {
          resultado.filtro.push({ ...p, precio: Number(p.precio || 0) });
        }
      });

      cachePrecios = resultado;
      cachePreciosTime = ahora;
      setPrecios(resultado);
    }

    cargarPrecios();
  }, []);

  return { precios, tipoCambio, redondearMXN };
}
