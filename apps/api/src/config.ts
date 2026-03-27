import 'dotenv/config';
import { z } from 'zod';

const optionalEnvString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.includes('...')) {
    return undefined;
  }

  return trimmed;
}, z.string().optional());

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(20),
  FIREBASE_PROJECT_ID: optionalEnvString,
  FIREBASE_CLIENT_EMAIL: optionalEnvString,
  FIREBASE_PRIVATE_KEY: optionalEnvString,
  CONTACT_FORWARD_TO: z.string().email().default('sales@mbmapps.com')
});

export type ApiConfig = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);
