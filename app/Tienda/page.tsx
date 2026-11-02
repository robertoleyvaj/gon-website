// app/Tienda/page.tsx — se arma en el servidor para que el catálogo venga en el HTML
// (Google y el rastreador de Meta ven los armazones, precios y enlaces sin ejecutar JavaScript).
import { supabase } from '../lib/supabase';
import TiendaCliente, { type Armazon, type ColorCard } from './TiendaCliente';

export const dynamic = 'force-dynamic';

export default async function Tienda() {
  const { data } = await supabase.from('armazones').select('*')
    .eq('activo', true).eq('publicar_gon', true).eq('tipo', 'optico').order('id');
  const armazones = (data || []) as Armazon[];
  const colores: Record<number, ColorCard[]> = {};
  const ids = armazones.map(a => a.id);
  if (ids.length) {
    const { data: cols } = await supabase.from('armazon_colores')
      .select('*').in('armazon_id', ids).eq('publicar_gon', true).order('orden');
    for (const c of (cols || []) as ColorCard[]) (colores[c.armazon_id] ||= []).push(c);
  }
  return <TiendaCliente inicial={{ armazones, colores }} />;
}
