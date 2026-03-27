import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  contactSubmissionSchema,
  demoMetricsResponseSchema,
  demoPipelineResponseSchema,
  eventTelemetrySchema,
  telemetryResponseSchema,
  type ApiError,
  type ContactSubmission
} from '@mbm/contracts';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import { logger } from './logger.js';
import { loadMetrics, loadPipeline, storeContact, storeTelemetry } from './repository.js';

const messageSchema = z.object({
  message: z.string().min(2)
});

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));
  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on('finish', () => {
      logger.info(
        {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt
        },
        'HTTP request complete'
      );
    });
    next();
  });

  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please try again shortly.'
    }
  });

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true, service: 'mbmapps-api' });
  });

  app.get('/v1/demo/metrics', limiter, async (_req, res, next) => {
    try {
      const metrics = await loadMetrics();
      const payload = demoMetricsResponseSchema.parse({ ok: true, metrics });
      res.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  });

  app.get('/v1/demo/pipeline', limiter, async (_req, res, next) => {
    try {
      const pipeline = await loadPipeline();
      const payload = demoPipelineResponseSchema.parse({ ok: true, pipeline });
      res.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  });

  app.post('/v1/contact', limiter, async (req, res, next) => {
    try {
      const parsed = contactSubmissionSchema.parse(req.body);

      if (parsed.website.trim().length > 0) {
        // Honeypot field silently treated as accepted to avoid bot feedback loops.
        res.status(200).json({ ok: true, submissionId: `spam_${randomUUID()}`, receivedAt: new Date().toISOString() });
        return;
      }

      const submission = {
        ...parsed,
        source: parsed.source || 'mbmapps.com'
      } satisfies ContactSubmission;

      const submissionId = await storeContact(submission);

      logger.info({ submissionId, to: config.CONTACT_FORWARD_TO }, 'Contact submission received');
      res.status(200).json({
        ok: true,
        submissionId,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/v1/events', limiter, async (req, res, next) => {
    try {
      const payload = eventTelemetrySchema.parse(req.body);
      await storeTelemetry(payload);
      res.status(200).json(telemetryResponseSchema.parse({ ok: true }));
    } catch (error) {
      next(error);
    }
  });

  app.use((_req: Request, res: Response<ApiError>) => {
    res.status(404).json({
      ok: false,
      code: 'NOT_FOUND',
      message: 'Route not found'
    });
  });

  app.use((error: unknown, _req: Request, res: Response<ApiError>, _next: () => void) => {
    const requestId = randomUUID();

    if (error instanceof z.ZodError) {
      res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: error.issues.map((issue) => issue.message).join('; '),
        requestId
      });
      return;
    }

    if (error instanceof Error && messageSchema.safeParse({ message: error.message }).success) {
      logger.error({ error, requestId }, 'Unhandled API error');
      res.status(500).json({
        ok: false,
        code: 'INTERNAL_ERROR',
        message: 'Unexpected server error',
        requestId
      });
      return;
    }

    logger.error({ error, requestId }, 'Unhandled API error');
    res.status(500).json({
      ok: false,
      code: 'INTERNAL_ERROR',
      message: 'Unexpected server error',
      requestId
    });
  });

  return app;
}
