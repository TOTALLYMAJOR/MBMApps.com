import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  QuietPilotPurchaseValidationError,
  buildQuietPilotCheckoutMetadata,
  parseQuietPilotPurchaseInput
} from '@/lib/quietpilot-purchase';

export const runtime = 'nodejs';

let stripeClient: Stripe | null = null;

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia'
    });
  }

  return stripeClient;
}

function publicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.APP_URL ?? 'https://www.mbmapps.com').replace(/\/+$/g, '');
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);

  try {
    const purchase = parseQuietPilotPurchaseInput(json);
    const metadata = buildQuietPilotCheckoutMetadata(purchase);
    const session = await getStripeClient().checkout.sessions.create({
      mode: 'payment',
      customer_email: purchase.ownerEmail,
      client_reference_id: purchase.organizationSlug,
      line_items: [
        {
          price: requireEnv('QUIETPILOT_STRIPE_PRICE_ID'),
          quantity: 1
        }
      ],
      metadata,
      payment_intent_data: {
        metadata
      },
      success_url:
        process.env.QUIETPILOT_PURCHASE_SUCCESS_URL ??
        `${publicSiteUrl()}/quietpilot/purchase?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        process.env.QUIETPILOT_PURCHASE_CANCEL_URL ?? `${publicSiteUrl()}/quietpilot/purchase?checkout=cancelled`
    });

    if (!session.url) {
      throw new Error('Stripe Checkout Session did not return a hosted URL.');
    }

    return NextResponse.json(
      {
        ok: true,
        checkoutUrl: session.url
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof QuietPilotPurchaseValidationError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    }

    console.error('QuietPilot purchase checkout failed', error);
    return NextResponse.json({ ok: false, message: 'Unable to start QuietPilot checkout.' }, { status: 500 });
  }
}
