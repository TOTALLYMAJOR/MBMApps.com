import { z } from 'zod';

export const demoMetricSchema = z.object({
  key: z.string().min(2),
  label: z.string().min(2),
  value: z.string().min(1),
  trend: z.string().min(1),
  trendDirection: z.enum(['up', 'down', 'neutral'])
});

export type DemoMetric = z.infer<typeof demoMetricSchema>;

export const pipelineDealSchema = z.object({
  id: z.string().min(2),
  account: z.string().min(2),
  owner: z.string().min(2),
  amount: z.number().nonnegative(),
  probability: z.number().min(0).max(100),
  expectedClose: z.string().datetime({ offset: true })
});

export type PipelineDeal = z.infer<typeof pipelineDealSchema>;

export const pipelineStageSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  count: z.number().int().nonnegative(),
  totalValue: z.number().nonnegative(),
  deals: z.array(pipelineDealSchema)
});

export type PipelineStage = z.infer<typeof pipelineStageSchema>;

export const pipelineSnapshotSchema = z.object({
  generatedAt: z.string().datetime({ offset: true }),
  currency: z.string().length(3),
  stages: z.array(pipelineStageSchema).min(1)
});

export type PipelineSnapshot = z.infer<typeof pipelineSnapshotSchema>;

export const contactSubmissionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().min(2).max(120),
  website: z.string().max(200).optional().default(''),
  message: z.string().min(20).max(3000),
  budget: z.enum(['under-10k', '10k-25k', '25k-75k', '75k-plus']),
  timeline: z.enum(['immediate', '30-days', 'quarter', 'exploring']),
  source: z.string().max(120).default('mbmapps.com')
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export const contactResponseSchema = z.object({
  ok: z.literal(true),
  submissionId: z.string(),
  receivedAt: z.string().datetime({ offset: true })
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;

export const apiErrorSchema = z.object({
  ok: z.literal(false),
  code: z.string(),
  message: z.string(),
  requestId: z.string().optional()
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const eventTelemetrySchema = z.object({
  event: z.enum(['contact_submitted', 'demo_login', 'case_study_viewed', 'web_vital']),
  path: z.string().min(1),
  at: z.string().datetime({ offset: true }),
  userId: z.string().optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).default({})
});

export type EventTelemetryPayload = z.infer<typeof eventTelemetrySchema>;

export const demoMetricsResponseSchema = z.object({
  ok: z.literal(true),
  metrics: z.array(demoMetricSchema)
});

export type DemoMetricsResponse = z.infer<typeof demoMetricsResponseSchema>;

export const demoPipelineResponseSchema = z.object({
  ok: z.literal(true),
  pipeline: pipelineSnapshotSchema
});

export type DemoPipelineResponse = z.infer<typeof demoPipelineResponseSchema>;

export const telemetryResponseSchema = z.object({
  ok: z.literal(true)
});

export type TelemetryResponse = z.infer<typeof telemetryResponseSchema>;

export const syntheticMetrics: DemoMetric[] = [
  {
    key: 'revenue',
    label: 'Annual Revenue Influenced',
    value: '$4.82M',
    trend: '+18.4% QoQ',
    trendDirection: 'up'
  },
  {
    key: 'quotes',
    label: 'Quotes Automated',
    value: '3,412',
    trend: '+22.1% MoM',
    trendDirection: 'up'
  },
  {
    key: 'conversion',
    label: 'Average Win Rate',
    value: '27.8%',
    trend: '+3.2 pts',
    trendDirection: 'up'
  }
];

export const syntheticPipeline: PipelineSnapshot = {
  generatedAt: new Date().toISOString(),
  currency: 'USD',
  stages: [
    {
      id: 'qualified',
      name: 'Qualified',
      count: 7,
      totalValue: 186000,
      deals: [
        {
          id: 'q-103',
          account: 'Lakefront Hospitality Group',
          owner: 'R. Patel',
          amount: 54000,
          probability: 40,
          expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString()
        }
      ]
    },
    {
      id: 'proposal',
      name: 'Proposal Sent',
      count: 5,
      totalValue: 292000,
      deals: [
        {
          id: 'p-207',
          account: 'Northwind Corporate Events',
          owner: 'A. Kim',
          amount: 97000,
          probability: 65,
          expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString()
        }
      ]
    },
    {
      id: 'negotiation',
      name: 'Negotiation',
      count: 3,
      totalValue: 421000,
      deals: [
        {
          id: 'n-311',
          account: 'Summit Foods National',
          owner: 'M. Barnett',
          amount: 210000,
          probability: 82,
          expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
        }
      ]
    }
  ]
};
