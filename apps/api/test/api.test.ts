import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('MBM API', () => {
  it('serves health check', async () => {
    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('returns demo metrics', async () => {
    const response = await request(app).get('/v1/demo/metrics');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.metrics)).toBe(true);
  });

  it('rejects invalid contact payloads', async () => {
    const response = await request(app).post('/v1/contact').send({ name: 'A' });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('accepts valid contact payload', async () => {
    const response = await request(app).post('/v1/contact').send({
      name: 'Jordan Lee',
      email: 'jordan@mbmapps.com',
      company: 'Northline Kitchens',
      message: 'We need a platform to automate quoting and measure conversion by segment.',
      budget: '25k-75k',
      timeline: '30-days',
      source: 'integration-test',
      website: ''
    });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('accepts telemetry payloads', async () => {
    const response = await request(app).post('/v1/events').send({
      event: 'web_vital',
      path: '/demo',
      at: new Date().toISOString(),
      metadata: {
        metric: 'LCP',
        value: 2043
      }
    });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
