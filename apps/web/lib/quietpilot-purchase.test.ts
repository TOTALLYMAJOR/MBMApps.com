import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_STARTER_PACK_ID,
  QuietPilotPurchaseActivationError,
  QuietPilotPurchaseValidationError,
  buildQuietPilotCheckoutMetadata,
  buildQuietPilotTenantActivationPayload,
  postQuietPilotTenantActivation,
  parseQuietPilotPurchaseInput
} from '@/lib/quietpilot-purchase';

describe('quietpilot purchase helpers', () => {
  it('normalizes purchase input and builds the minimum checkout metadata', () => {
    const purchase = parseQuietPilotPurchaseInput({
      organizationName: '  Acme Field Services, LLC  ',
      ownerFullName: '  Jordan Rivera  ',
      ownerEmail: '  JORDAN@ACME.EXAMPLE  ',
      timezone: 'America/New_York',
      currency: 'usd',
      starterPackId: 'command-center'
    });

    expect(purchase).toEqual({
      organizationName: 'Acme Field Services, LLC',
      organizationSlug: 'acme-field-services-llc',
      ownerFullName: 'Jordan Rivera',
      ownerEmail: 'jordan@acme.example',
      timezone: 'America/New_York',
      currency: 'USD',
      starterPackId: 'command-center'
    });

    expect(buildQuietPilotCheckoutMetadata(purchase)).toEqual({
      organization_name: 'Acme Field Services, LLC',
      organization_slug: 'acme-field-services-llc',
      owner_name: 'Jordan Rivera',
      owner_email: 'jordan@acme.example',
      tenant_timezone: 'America/New_York',
      tenant_currency: 'USD',
      starter_pack_id: 'command-center'
    });
  });

  it('accepts an explicit organization slug and defaults the starter pack', () => {
    const purchase = parseQuietPilotPurchaseInput({
      organizationName: 'North Ridge Ops',
      organizationSlug: ' North_Ridge Ops! ',
      ownerFullName: 'Casey Morgan',
      ownerEmail: 'casey@example.com'
    });

    expect(purchase.organizationSlug).toBe('north-ridge-ops');
    expect(purchase.starterPackId).toBe(DEFAULT_STARTER_PACK_ID);
    expect(purchase.timezone).toBe('America/Chicago');
    expect(purchase.currency).toBe('USD');
  });

  it('rejects invalid owner emails and unusable organization slugs', () => {
    expect(() =>
      parseQuietPilotPurchaseInput({
        organizationName: 'Acme',
        ownerFullName: 'Jordan Rivera',
        ownerEmail: 'not-an-email'
      })
    ).toThrow(QuietPilotPurchaseValidationError);

    expect(() =>
      parseQuietPilotPurchaseInput({
        organizationName: 'Acme',
        organizationSlug: '---',
        ownerFullName: 'Jordan Rivera',
        ownerEmail: 'jordan@example.com'
      })
    ).toThrow(QuietPilotPurchaseValidationError);
  });

  it('builds tenant activation payloads only from paid checkout sessions', () => {
    const metadata = buildQuietPilotCheckoutMetadata(
      parseQuietPilotPurchaseInput({
        organizationName: 'Acme Field Services',
        ownerFullName: 'Jordan Rivera',
        ownerEmail: 'jordan@example.com',
        starterPackId: 'ops-launch'
      })
    );

    expect(
      buildQuietPilotTenantActivationPayload({
        id: 'cs_test_123',
        payment_status: 'paid',
        metadata,
        customer: 'cus_123',
        payment_intent: { id: 'pi_123' }
      })
    ).toEqual({
      activationReference: 'cs_test_123',
      paymentEvidence: {
        provider: 'stripe',
        reference: 'pi_123',
        verified: true
      },
      tenant: {
        name: 'Acme Field Services',
        slug: 'acme-field-services',
        timezone: 'America/Chicago',
        currency: 'USD'
      },
      owner: {
        email: 'jordan@example.com',
        fullName: 'Jordan Rivera'
      },
      starterPackId: 'ops-launch'
    });

    expect(() =>
      buildQuietPilotTenantActivationPayload({
        id: 'cs_test_unpaid',
        payment_status: 'unpaid',
        metadata
      })
    ).toThrow(QuietPilotPurchaseActivationError);
  });

  it('posts tenant activation payloads with the QuietPilot shared secret header', async () => {
    const payload = buildQuietPilotTenantActivationPayload({
      id: 'cs_test_123',
      payment_status: 'paid',
      metadata: buildQuietPilotCheckoutMetadata(
        parseQuietPilotPurchaseInput({
          organizationName: 'Acme Field Services',
          ownerFullName: 'Jordan Rivera',
          ownerEmail: 'jordan@example.com'
        })
      ),
      payment_intent: 'pi_123'
    });
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, data: { status: 'activated' } }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await expect(
      postQuietPilotTenantActivation(payload, {
        url: 'https://app.quietpilot.com/api/v1/onboarding/tenant-activations',
        secret: 'shared-secret',
        fetchImpl
      })
    ).resolves.toEqual({ ok: true, data: { status: 'activated' } });

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://app.quietpilot.com/api/v1/onboarding/tenant-activations',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-activation-secret': 'shared-secret'
        },
        body: JSON.stringify(payload)
      })
    );
  });
});
