import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('gon_admin')?.value;
  return !!process.env.ADMIN_TOKEN_SECRET && token === process.env.ADMIN_TOKEN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const campo = formData.get('campo') as string;
  const id = formData.get('id') as string;

  if (!file || !campo || !id) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  // Solo imágenes, y nombre de archivo limpio (nada de rutas ni extensiones raras)
  const TIPOS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
  const ext = TIPOS[file.type];
  if (!ext) return NextResponse.json({ error: 'Solo se permiten imágenes JPG, PNG, WEBP o AVIF' }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'La imagen pesa más de 10 MB' }, { status: 400 });
  const limpio = (s: string) => String(s).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
  const nombre = `armazon-${limpio(id)}-${limpio(campo)}-${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from('armazones')
    .upload(nombre, buffer, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from('armazones').getPublicUrl(nombre);
  return NextResponse.json({ url: data.publicUrl });
}