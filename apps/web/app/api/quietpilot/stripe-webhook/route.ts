import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  QuietPilotPurchaseActivationError,
  buildQuietPilotTenantActivationPayload,
  postQuietPilotTenantActivation
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

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function tenantActivationSecret() {
  const value = process.env.QUIETPILOT_TENANT_ACTIVATION_SECRET ?? process.env.TENANT_ACTIVATION_SECRET;

  if (!value) {
    throw new Error('QUIETPILOT_TENANT_ACTIVATION_SECRET is required.');
  }

  return value;
}

export async function POST(request: Request) {
  const stripeSignature = request.headers.get('stripe-signature');

  if (!stripeSignature) {
    return NextResponse.json({ ok: false, message: 'Missing Stripe signature.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripeClient().webhooks.constructEvent(
      await request.text(),
      stripeSignature,
      requireEnv('STRIPE_WEBHOOK_SECRET')
    );
  } catch (error) {
    console.error('QuietPilot Stripe webhook verification failed', error);
    return NextResponse.json({ ok: false, message: 'Invalid Stripe webhook signature.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ ok: true, received: true, skipped: 'checkout_not_paid' });
  }

  try {
    const activationPayload = buildQuietPilotTenantActivationPayload(session);
    await postQuietPilotTenantActivation(activationPayload, {
      url: requireEnv('QUIETPILOT_TENANT_ACTIVATION_URL'),
      secret: tenantActivationSecret()
    });

    return NextResponse.json({ ok: true, received: true, activated: true });
  } catch (error) {
    const status = error instanceof QuietPilotPurchaseActivationError ? 502 : 500;
    console.error('QuietPilot tenant activation from Stripe webhook failed', error);
    return NextResponse.json({ ok: false, message: 'QuietPilot tenant activation failed.' }, { status });
  }
}
