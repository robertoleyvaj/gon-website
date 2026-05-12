// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { items, total } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      // ── Shipping address ──────────────────────────────────────────────
      shipping_address_collection: {
        allowed_countries: ['US', 'MX', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      // ─────────────────────────────────────────────────────────────────

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Verly Optical — Lentes personalizados',
              description: String(items),
            },
            unit_amount: Math.round(Number(total) * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gracias`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/Tienda`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}