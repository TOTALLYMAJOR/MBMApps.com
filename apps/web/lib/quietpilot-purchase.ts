import { z } from 'zod';

export const DEFAULT_STARTER_PACK_ID = 'catering';
export const DEFAULT_TIMEZONE = 'America/Chicago';
export const DEFAULT_CURRENCY = 'USD';

const tenantSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const purchaseInputSchema = z.object({
  organizationName: z.string().trim().min(2).max(120),
  organizationSlug: z.string().trim().max(120).optional(),
  ownerFullName: z.string().trim().min(2).max(120),
  ownerEmail: z.string().trim().email(),
  timezone: z.string().trim().min(3).max(80).optional(),
  currency: z.string().trim().length(3).optional(),
  starterPackId: z.string().trim().min(1).max(80).optional()
});

export type QuietPilotPurchaseInput = z.infer<typeof purchaseInputSchema>;

export type QuietPilotPurchase = {
  organizationName: string;
  organizationSlug: string;
  ownerFullName: string;
  ownerEmail: string;
  timezone: string;
  currency: string;
  starterPackId: string;
};

export type QuietPilotCheckoutMetadata = {
  organization_name: string;
  organization_slug: string;
  owner_name: string;
  owner_email: string;
  tenant_timezone: string;
  tenant_currency: string;
  starter_pack_id: string;
};

export type QuietPilotTenantActivationPayload = {
  activationReference: string;
  paymentEvidence: {
    provider: 'stripe';
    reference: string;
    verified: true;
  };
  tenant: {
    name: string;
    slug: string;
    timezone: string;
    currency: string;
  };
  owner: {
    email: string;
    fullName: string;
  };
  starterPackId: string;
};

type StripeObjectReference = string | { id?: string | null } | null | undefined;

export type QuietPilotCheckoutSessionLike = {
  id: string;
  payment_status?: string | null;
  metadata?: Record<string, string | null | undefined> | null;
  customer?: StripeObjectReference;
  payment_intent?: StripeObjectReference;
};

export class QuietPilotPurchaseValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuietPilotPurchaseValidationError';
  }
}

export class QuietPilotPurchaseActivationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuietPilotPurchaseActivationError';
  }
}

export function slugifyQuietPilotTenant(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 63)
    .replace(/-+$/g, '');
}

function validateTenantSlug(slug: string) {
  if (slug.length < 3 || slug.length > 63 || !tenantSlugPattern.test(slug)) {
    throw new QuietPilotPurchaseValidationError('Organization slug must contain at least three letters or numbers.');
  }
}

export function parseQuietPilotPurchaseInput(input: unknown): QuietPilotPurchase {
  const parsed = purchaseInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new QuietPilotPurchaseValidationError('QuietPilot purchase input is invalid.');
  }

  const data = parsed.data;
  const organizationSlug = slugifyQuietPilotTenant(data.organizationSlug || data.organizationName);

  validateTenantSlug(organizationSlug);

  return {
    organizationName: data.organizationName,
    organizationSlug,
    ownerFullName: data.ownerFullName,
    ownerEmail: data.ownerEmail.toLowerCase(),
    timezone: data.timezone || DEFAULT_TIMEZONE,
    currency: (data.currency || DEFAULT_CURRENCY).toUpperCase(),
    starterPackId: data.starterPackId || DEFAULT_STARTER_PACK_ID
  };
}

export function buildQuietPilotCheckoutMetadata(purchase: QuietPilotPurchase): QuietPilotCheckoutMetadata {
  return {
    organization_name: purchase.organizationName,
    organization_slug: purchase.organizationSlug,
    owner_name: purchase.ownerFullName,
    owner_email: purchase.ownerEmail,
    tenant_timezone: purchase.timezone,
    tenant_currency: purchase.currency,
    starter_pack_id: purchase.starterPackId
  };
}

function readMetadata(metadata: QuietPilotCheckoutSessionLike['metadata'], key: keyof QuietPilotCheckoutMetadata) {
  const value = metadata?.[key];

  if (!value || value.trim().length === 0) {
    throw new QuietPilotPurchaseActivationError(`Missing Stripe Checkout metadata: ${key}`);
  }

  return value.trim();
}

function stripeObjectId(value: StripeObjectReference) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  return typeof value.id === 'string' && value.id.length > 0 ? value.id : null;
}

export function buildQuietPilotTenantActivationPayload(
  session: QuietPilotCheckoutSessionLike
): QuietPilotTenantActivationPayload {
  if (session.payment_status !== 'paid') {
    throw new QuietPilotPurchaseActivationError('Stripe Checkout Session must be paid before tenant activation.');
  }

  const organizationName = readMetadata(session.metadata, 'organization_name');
  const organizationSlug = readMetadata(session.metadata, 'organization_slug');
  const ownerFullName = readMetadata(session.metadata, 'owner_name');
  const ownerEmail = readMetadata(session.metadata, 'owner_email').toLowerCase();
  const timezone = readMetadata(session.metadata, 'tenant_timezone');
  const currency = readMetadata(session.metadata, 'tenant_currency').toUpperCase();
  const starterPackId = readMetadata(session.metadata, 'starter_pack_id');
  const paymentReference = stripeObjectId(session.payment_intent) || session.id;

  validateTenantSlug(organizationSlug);

  return {
    activationReference: session.id,
    paymentEvidence: {
      provider: 'stripe',
      reference: paymentReference,
      verified: true
    },
    tenant: {
      name: organizationName,
      slug: organizationSlug,
      timezone,
      currency
    },
    owner: {
      email: ownerEmail,
      fullName: ownerFullName
    },
    starterPackId
  };
}

export async function postQuietPilotTenantActivation(
  payload: QuietPilotTenantActivationPayload,
  options: {
    url: string;
    secret: string;
    fetchImpl?: typeof fetch;
  }
) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(options.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-activation-secret': options.secret
    },
    cache: 'no-store',
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => '');
    const suffix = responseBody ? `: ${responseBody.slice(0, 500)}` : '';
    throw new QuietPilotPurchaseActivationError(`QuietPilot tenant activation failed (${response.status})${suffix}`);
  }

  return response.json().catch(() => ({ ok: true }));
}
