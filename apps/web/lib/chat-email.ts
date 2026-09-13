import type { ChatLeadSubmission } from '@mbm/contracts';

export type ChatEmailConfig = {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
};

export class ChatEmailDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatEmailDeliveryError';
  }
}

export function buildChatEmailText(input: Pick<ChatLeadSubmission, 'replyTo' | 'transcript'>) {
  return [
    'A visitor sent a transcript from the MBMApps website chat.',
    '',
    `Reply to: ${input.replyTo}`,
    '',
    'Transcript:',
    input.transcript
  ].join('\n');
}

export async function sendChatEmail(
  input: Pick<ChatLeadSubmission, 'replyTo' | 'transcript'>,
  config: ChatEmailConfig,
  fetchImpl: typeof fetch = fetch
) {
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [config.toEmail],
      reply_to: input.replyTo,
      subject: 'MBMApps website chat transcript',
      text: buildChatEmailText(input)
    })
  });

  if (!response.ok) {
    throw new ChatEmailDeliveryError(`Email provider rejected the request with status ${response.status}.`);
  }

  return response;
}
