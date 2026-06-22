'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type ConfigLente = {
  id: number;
  tipo: 'vision' | 'material' | 'filtro';
  key: string;
  nombre_es: string;
  nombre_en: string;
  precio_verly: number;
  precio_gon: number;
  activo: boolean;
  orden: number;
};

let cache: ConfigLente[] | null = null;
let cacheTime = 0;
const TTL = 5 * 60 * 1000; // 5 min

export function useConfigLentes() {
  const [config, setConfig] = useState<ConfigLente[]>(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache && Date.now() - cacheTime < TTL) {
      setConfig(cache);
      setLoading(false);
      return;
    }
    supabase
      .from('config_lentes')
      .select('*')
      .eq('activo', true)
      .order('tipo')
      .order('orden')
      .then(({ data }) => {
        if (data) { cache = data as ConfigLente[]; cacheTime = Date.now(); setConfig(data as ConfigLente[]); }
        setLoading(false);
      });
  }, []);

  const byTipo = (tipo: string) => config.filter(c => c.tipo === tipo);
  const byKey = (key: string) => config.find(c => c.key === key);

  return { config, loading, byTipo, byKey };
}
