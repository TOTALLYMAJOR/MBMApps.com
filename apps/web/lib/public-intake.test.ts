import { describe, expect, it } from 'vitest';
import {
  PUBLIC_INTAKE_BODY_LIMIT_BYTES,
  readPublicIntakePayload
} from '@/lib/public-intake';

function makeRequest(body: string, origin = 'https://mbmapps.com') {
  return new Request('https://mbmapps.com/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: origin
    },
    body
  });
}

describe('public intake request boundary', () => {
  it('accepts a same-origin JSON request', async () => {
    await expect(readPublicIntakePayload(makeRequest('{"hello":"world"}'))).resolves.toEqual({ hello: 'world' });
  });

  it('rejects cross-origin requests', async () => {
    await expect(readPublicIntakePayload(makeRequest('{}', 'https://attacker.example'))).rejects.toMatchObject({
      status: 403
    });
  });

  it('rejects oversized payloads even without a content-length header', async () => {
    const request = makeRequest(JSON.stringify({ message: 'x'.repeat(PUBLIC_INTAKE_BODY_LIMIT_BYTES) }));
    request.headers.delete('content-length');

    await expect(readPublicIntakePayload(request)).rejects.toMatchObject({ status: 413 });
  });

  it('rejects malformed JSON', async () => {
    await expect(readPublicIntakePayload(makeRequest('{not-json'))).rejects.toMatchObject({ status: 400 });
  });
});
