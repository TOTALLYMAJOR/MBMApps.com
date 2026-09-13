import { describe, expect, it, vi } from 'vitest';
import { chatLeadSubmissionSchema } from '@mbm/contracts';
import { ChatEmailDeliveryError, buildChatEmailText, sendChatEmail } from '@/lib/chat-email';

describe('chat email delivery', () => {
  const request = {
    replyTo: 'visitor@example.com',
    transcript: 'Visitor: I need a workflow review.\nMBMApps: We can help with that.',
    consent: {
      dataProcessingAccepted: true as const,
      marketingOptIn: false,
      acceptedAt: '2026-09-13T12:00:00.000Z',
      policyVersion: '2026-05-05'
    },
    website: ''
  };

  it('validates an explicit reply address, transcript, and consent', () => {
    expect(chatLeadSubmissionSchema.parse(request)).toMatchObject(request);
    expect(chatLeadSubmissionSchema.safeParse({
      ...request,
      consent: { ...request.consent, dataProcessingAccepted: false }
    }).success).toBe(false);
  });

  it('formats a plain-text message without interpreting visitor content as HTML', () => {
    expect(buildChatEmailText(request)).toContain('Reply to: visitor@example.com');
    expect(buildChatEmailText({ ...request, transcript: '<script>alert(1)</script>' })).toContain('<script>alert(1)</script>');
  });

  it('sends through the configured provider to the fixed studio recipient', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }));

    await sendChatEmail(request, {
      apiKey: 'test-key',
      fromEmail: 'MBMApps <website@example.com>',
      toEmail: 'flightcontrol@quietpilot.us'
    }, fetchImpl);

    expect(fetchImpl).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer test-key' })
    }));
    const body = JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body));
    expect(body.to).toEqual(['flightcontrol@quietpilot.us']);
    expect(body.reply_to).toBe('visitor@example.com');
    expect(body.text).toContain(request.transcript);
  });

  it('fails visibly when the provider rejects delivery', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 429 }));

    await expect(sendChatEmail(request, {
      apiKey: 'test-key',
      fromEmail: 'MBMApps <website@example.com>',
      toEmail: 'flightcontrol@quietpilot.us'
    }, fetchImpl)).rejects.toBeInstanceOf(ChatEmailDeliveryError);
  });
});
