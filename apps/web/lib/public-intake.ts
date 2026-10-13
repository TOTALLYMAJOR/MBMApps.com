export const PUBLIC_INTAKE_BODY_LIMIT_BYTES = 16 * 1024;

export class PublicIntakeRequestError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 403 | 413
  ) {
    super(message);
    this.name = 'PublicIntakeRequestError';
  }
}

export function backendBaseUrl() {
  return process.env.BACKEND_API_URL ?? 'http://localhost:4000';
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin === null) return;

  try {
    const requestUrl = new URL(request.url);
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
      || requestUrl.protocol.slice(0, -1);
    const requestOrigin = host ? new URL(`${protocol}://${host}`).origin : requestUrl.origin;

    if (new URL(origin).origin !== requestOrigin) {
      throw new PublicIntakeRequestError('Cross-origin intake requests are not accepted.', 403);
    }
  } catch (error) {
    if (error instanceof PublicIntakeRequestError) throw error;
    throw new PublicIntakeRequestError('Invalid request origin.', 403);
  }
}

export async function readPublicIntakePayload(request: Request): Promise<unknown> {
  assertSameOrigin(request);

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > PUBLIC_INTAKE_BODY_LIMIT_BYTES) {
    throw new PublicIntakeRequestError('Request payload is too large.', 413);
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > PUBLIC_INTAKE_BODY_LIMIT_BYTES) {
    throw new PublicIntakeRequestError('Request payload is too large.', 413);
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new PublicIntakeRequestError('Invalid JSON request payload.', 400);
  }
}
