// Feed de productos de GON para el Catálogo de Meta (y Google si se quiere). Precios en pesos.
// URL: https://gonmx.com/feed/productos
// Una entrada por COLOR publicado en GON; item_group_id = id del armazón.
import { supabaseServidor } from '../../lib/supabase-server';
import { precioGon } from '../../lib/precio-gon';
import { nombreMaterial } from '../../lib/textos';
import { nombreColor } from '../../lib/colores';
import { FORMAS, normForma, tallaDeMedidas } from '../../lib/armazon-web';

export const revalidate = 3600; // se regenera cada hora

const BASE = 'https://gonmx.com';
const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Existencia de las ópticas físicas + bodega (GON no vende del inventario online de Verly)
const STOCK = ['stock_baja', 'stock_mayo', 'stock_plaza', 'bodega'];

export async function GET() {
  const sb = supabaseServidor();
  const { data: arms } = await sb.from('armazones').select('*').eq('activo', true).eq('publicar_gon', true).eq('tipo', 'optico');
  const lista = arms ?? [];
  const ids = lista.map(a => a.id);
  const { data: cols } = ids.length
    ? await sb.from('armazon_colores').select('*').in('armazon_id', ids).eq('publicar_gon', true).order('orden')
    : { data: [] as any[] };
  const porModelo: Record<number, any[]> = {};
  for (const c of cols ?? []) (porModelo[c.armazon_id] ||= []).push(c);

  const items: string[] = [];
  for (const a of lista) {
    const precioLista = Number(a.precio_gon) || 0;
    if (!precioLista) continue;
    const precio = precioGon(a);
    const fk = normForma(a.forma);
    const forma = fk ? FORMAS.find(f => f.v === fk)?.es ?? '' : '';
    const material = nombreMaterial(a.material, 'es');
    const talla = tallaDeMedidas(a.medidas)?.talla;
    const inventarioNuevo = /^VRL-1\d{3}$/.test(String(a.sku ?? ''));
    const genero = a.genero === 'hombre' ? 'male' : a.genero === 'mujer' ? 'female' : 'unisex';
    const edad = a.genero === 'nino' ? 'kids' : 'adult';
    const desc = (a.descripcion_es || '').trim() ||
      `Armazón ${[forma, material].filter(Boolean).join(' de ').toLowerCase() || 'oftálmico'} disponible en nuestras ópticas de Playas de Rosarito. Examen de la vista gratis y atención bilingüe. Apártalo por WhatsApp.`;

    const variantes = (porModelo[a.id] ?? []).length ? porModelo[a.id] : [null];
    for (const c of variantes) {
      const fotos = [c?.imagen_url, c?.imagen2_url, c?.imagen3_url, c?.imagen4_url, a.imagen_url, a.imagen2_url, a.imagen3_url, c?.portada_url].filter(Boolean) as string[];
      if (!fotos.length) continue;
      const color = c ? nombreColor(c.color, 'es') : '';
      const hay = !inventarioNuevo || !c || STOCK.reduce((s, k) => s + (Number(c[k]) || 0), 0) > 0;
      const id = `GON-${c?.sku || a.sku || a.id}`;
      const link = `${BASE}/armazon/${a.id}${c?.sku ? `?color=${encodeURIComponent(c.sku)}` : ''}`;
      const titulo = `${a.nombre || a.modelo} · Armazón ${[forma, material].filter(Boolean).join(' ')}${color ? ` · ${color}` : ''}`.replace(/\s+/g, ' ');
      items.push(`    <item>
      <g:id>${esc(id)}</g:id>
      <g:item_group_id>${a.id}</g:item_group_id>
      <g:title>${esc(titulo.slice(0, 150))}</g:title>
      <g:description>${esc(desc.slice(0, 5000))}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(fotos[0])}</g:image_link>
${[...new Set(fotos.slice(1))].slice(0, 9).map(f => `      <g:additional_image_link>${esc(f)}</g:additional_image_link>`).join('\n')}
      <g:availability>${hay ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${precioLista.toFixed(2)} MXN</g:price>
${precio < precioLista ? `      <g:sale_price>${precio.toFixed(2)} MXN</g:sale_price>\n` : ''}      <g:condition>new</g:condition>
      <g:brand>${esc(a.marca || 'GON')}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Health &amp; Beauty &gt; Personal Care &gt; Vision Care &gt; Eyeglasses</g:google_product_category>
      <g:product_type>Armazones &gt; ${esc(forma || 'Oftálmicos')}</g:product_type>
      <g:gender>${genero}</g:gender>
      <g:age_group>${edad}</g:age_group>
${color ? `      <g:color>${esc(color)}</g:color>\n` : ''}${material ? `      <g:material>${esc(material)}</g:material>\n` : ''}${talla ? `      <g:size>${talla}</g:size>\n` : ''}    </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>GON — Grupo Óptico del Noroeste</title>
    <link>${BASE}</link>
    <description>Armazones disponibles en nuestras ópticas de Playas de Rosarito</description>
${items.join('\n')}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
