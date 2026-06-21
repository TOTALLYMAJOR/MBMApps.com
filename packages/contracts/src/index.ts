import { z } from 'zod';

export const schemaVersion = 1 as const;

const metadataValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const decisionRoleSchema = z.enum([
  'owner',
  'executive',
  'operations-leader',
  'revenue-leader',
  'technical-leader',
  'individual-contributor',
  'consultant',
  'other'
]);

export const companySizeSchema = z.enum(['unknown', '1-10', '11-50', '51-200', '201-500', '500-plus']);

export const serviceCategorySchema = z.enum([
  'hospitality',
  'field-services',
  'events',
  'food-services',
  'saas',
  'professional-services',
  'other'
]);

export const operationalMaturitySchema = z.enum(['unknown', 'manual', 'spreadsheet-led', 'tool-assisted', 'systematized', 'optimized']);

export const primaryBusinessPainSchema = z.enum([
  'quote-speed',
  'conversion-visibility',
  'job-readiness',
  'staffing-risk',
  'payment-risk',
  'inventory-control',
  'platform-reliability',
  'data-fragmentation',
  'other'
]);

export const topConstraintSchema = z.enum([
  'none',
  'budget',
  'timeline',
  'team-capacity',
  'data-quality',
  'integration-complexity',
  'change-management',
  'unclear-scope'
]);

export const contactLifecycleStatusSchema = z.enum([
  'new',
  'qualified',
  'discovery_booked',
  'demo_completed',
  'proposal_sent',
  'closed_won',
  'closed_lost',
  'implementation_started',
  'measured_outcome'
]);

export const demoMetricSchema = z.object({
  key: z.string().min(2),
  label: z.string().min(2),
  value: z.string().min(1),
  trend: z.string().min(1),
  trendDirection: z.enum(['up', 'down', 'neutral']),
  numericValue: z.number().optional(),
  unit: z.string().min(1).max(40).optional(),
  period: z.string().min(1).max(40).optional(),
  championSignal: z.string().min(2).max(160).optional()
});

export type DemoMetric = z.infer<typeof demoMetricSchema>;

export const pipelineDealSchema = z.object({
  id: z.string().min(2),
  account: z.string().min(2),
  owner: z.string().min(2),
  amount: z.number().nonnegative(),
  probability: z.number().min(0).max(100),
  expectedClose: z.string().datetime({ offset: true }),
  quoteTurnaroundHours: z.number().nonnegative().optional(),
  proposalViews: z.number().int().nonnegative().optional(),
  jobReadinessRate: z.number().min(0).max(100).optional(),
  paymentRiskAmount: z.number().nonnegative().optional(),
  staffingGaps: z.number().int().nonnegative().optional(),
  inventoryBlockers: z.number().int().nonnegative().optional()
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

export const championProfileSchema = z.object({
  schemaVersion: z.literal(schemaVersion).default(schemaVersion),
  role: decisionRoleSchema.default('other'),
  industry: z.string().min(2).max(120).default('Unknown'),
  companySize: companySizeSchema.default('unknown'),
  locationCount: z.number().int().nonnegative().default(1),
  teamSize: z.number().int().nonnegative().optional(),
  monthlyQuoteVolume: z.number().int().nonnegative().optional(),
  serviceCategory: serviceCategorySchema.default('other'),
  currentTools: z.array(z.string().min(1).max(80)).max(12).default([]),
  currentCrmOrOpsSystem: z.string().max(160).default(''),
  operationalMaturity: operationalMaturitySchema.default('unknown'),
  primaryBusinessPain: primaryBusinessPainSchema.default('other'),
  topConstraint: topConstraintSchema.default('none')
});

export type ChampionProfile = z.infer<typeof championProfileSchema>;

export const championScoreSchema = z.object({
  schemaVersion: z.literal(schemaVersion).default(schemaVersion),
  total: z.number().min(0).max(100),
  fit: z.number().min(0).max(100),
  urgency: z.number().min(0).max(100),
  adoptionIntent: z.number().min(0).max(100),
  operationalComplexity: z.number().min(0).max(100),
  commercialReadiness: z.number().min(0).max(100),
  outcomePotential: z.number().min(0).max(100),
  reasons: z.array(z.string().min(2).max(180)).max(8),
  computedAt: z.string().datetime({ offset: true }).default(() => new Date().toISOString())
});

export type ChampionScore = z.infer<typeof championScoreSchema>;

export const consentMetadataSchema = z.object({
  dataProcessingAccepted: z.boolean().default(false),
  marketingOptIn: z.boolean().default(false),
  acceptedAt: z.string().datetime({ offset: true }).optional(),
  policyVersion: z.string().max(40).default('2026-05-05')
});

export type ConsentMetadata = z.infer<typeof consentMetadataSchema>;

export const contactSubmissionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().min(2).max(120),
  website: z.string().max(200).optional().default(''),
  message: z.string().min(20).max(3000),
  budget: z.enum(['under-10k', '10k-25k', '25k-75k', '75k-plus']),
  timeline: z.enum(['immediate', '30-days', 'quarter', 'exploring']),
  source: z.string().max(120).default('mbmapps.com'),
  decisionRole: decisionRoleSchema.default('other'),
  industry: z.string().min(2).max(120).default('Unknown'),
  companySize: companySizeSchema.default('unknown'),
  locationCount: z.coerce.number().int().nonnegative().default(1),
  teamSize: z.coerce.number().int().nonnegative().optional(),
  monthlyQuoteVolume: z.coerce.number().int().nonnegative().optional(),
  serviceCategory: serviceCategorySchema.default('other'),
  currentTools: z.array(z.string().min(1).max(80)).max(12).default([]),
  currentCrmOrOpsSystem: z.string().max(160).default(''),
  operationalMaturity: operationalMaturitySchema.default('unknown'),
  primaryBusinessPain: primaryBusinessPainSchema.default('other'),
  topConstraint: topConstraintSchema.default('none'),
  consent: consentMetadataSchema.default({})
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

export const utmAttributionSchema = z.object({
  source: z.string().max(120).optional(),
  medium: z.string().max(120).optional(),
  campaign: z.string().max(160).optional(),
  term: z.string().max(160).optional(),
  content: z.string().max(160).optional()
});

export type UtmAttribution = z.infer<typeof utmAttributionSchema>;

export const telemetryContextSchema = z.object({
  sessionId: z.string().min(6).max(120).optional(),
  anonymousId: z.string().min(6).max(120).optional(),
  referrer: z.string().max(500).default(''),
  routeSource: z.string().max(200).default('direct'),
  deviceClass: z.enum(['desktop', 'tablet', 'mobile', 'bot', 'unknown']).default('unknown'),
  utm: utmAttributionSchema.default({})
});

export type TelemetryContext = z.infer<typeof telemetryContextSchema>;

export const telemetryEventNameSchema = z.enum([
  'contact_submitted',
  'contact_filtered',
  'contact_queued',
  'demo_login',
  'demo_role_resolved',
  'demo_started',
  'demo_stage_selected',
  'demo_time_spent',
  'dashboard_drilldown_viewed',
  'case_study_viewed',
  'content_read',
  'web_vital',
  'cta_clicked',
  'quietpilot_opened',
  'proposal_viewed',
  'filter_used',
  'quote_interest',
  'scheduling_started',
  'scheduling_completed'
]);

export const eventTelemetrySchema = z.object({
  schemaVersion: z.literal(schemaVersion).default(schemaVersion),
  event: telemetryEventNameSchema,
  path: z.string().min(1),
  at: z.string().datetime({ offset: true }),
  userId: z.string().optional(),
  source: z.enum(['web', 'api', 'product', 'server']).default('web'),
  context: telemetryContextSchema.default({}),
  metadata: z.record(metadataValueSchema).default({})
});

export type EventTelemetryPayload = z.infer<typeof eventTelemetrySchema>;

export const operationalOutcomeSnapshotSchema = z.object({
  schemaVersion: z.literal(schemaVersion).default(schemaVersion),
  capturedAt: z.string().datetime({ offset: true }),
  period: z.string().min(1).max(40),
  source: z.enum(['synthetic', 'firestore', 'manual', 'product']).default('synthetic'),
  revenueInfluenced: z.number().nonnegative(),
  quotesAutomated: z.number().int().nonnegative(),
  averageWinRate: z.number().min(0).max(100),
  quoteTurnaroundHours: z.number().nonnegative(),
  averageResponseMinutes: z.number().nonnegative(),
  proposalViews: z.number().int().nonnegative(),
  jobReadinessRate: z.number().min(0).max(100),
  paymentRiskAmount: z.number().nonnegative(),
  staffingGaps: z.number().int().nonnegative(),
  inventoryBlockers: z.number().int().nonnegative()
});

export type OperationalOutcomeSnapshot = z.infer<typeof operationalOutcomeSnapshotSchema>;

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

export const operationalOutcomeResponseSchema = z.object({
  ok: z.literal(true),
  outcomes: operationalOutcomeSnapshotSchema
});

export type OperationalOutcomeResponse = z.infer<typeof operationalOutcomeResponseSchema>;

export const telemetryResponseSchema = z.object({
  ok: z.literal(true)
});

export type TelemetryResponse = z.infer<typeof telemetryResponseSchema>;

export const championCohortSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  count: z.number().int().nonnegative(),
  averageScore: z.number().min(0).max(100),
  primarySignals: z.array(z.string().min(2).max(160)),
  conversionRate: z.number().min(0).max(100),
  averageRevenueInfluenced: z.number().nonnegative(),
  generatedAt: z.string().datetime({ offset: true })
});

export type ChampionCohort = z.infer<typeof championCohortSchema>;

export const championCohortsResponseSchema = z.object({
  ok: z.literal(true),
  cohorts: z.array(championCohortSchema),
  generatedAt: z.string().datetime({ offset: true })
});

export type ChampionCohortsResponse = z.infer<typeof championCohortsResponseSchema>;

export const syntheticMetrics: DemoMetric[] = [
  {
    key: 'revenue',
    label: 'Annual Revenue Influenced',
    value: '$4.82M',
    trend: '+18.4% QoQ',
    trendDirection: 'up',
    numericValue: 4_820_000,
    unit: 'USD',
    period: 'annual',
    championSignal: 'Operators can connect workflow adoption to influenced revenue.'
  },
  {
    key: 'quotes',
    label: 'Quotes Automated',
    value: '3,412',
    trend: '+22.1% MoM',
    trendDirection: 'up',
    numericValue: 3412,
    unit: 'quotes',
    period: 'monthly',
    championSignal: 'High quote volume makes automation value easier to prove.'
  },
  {
    key: 'conversion',
    label: 'Average Win Rate',
    value: '27.8%',
    trend: '+3.2 pts',
    trendDirection: 'up',
    numericValue: 27.8,
    unit: 'percent',
    period: 'quarterly',
    championSignal: 'Win-rate lift validates better follow-up and proposal timing.'
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
          expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
          quoteTurnaroundHours: 18,
          proposalViews: 1,
          jobReadinessRate: 68,
          paymentRiskAmount: 4500,
          staffingGaps: 1,
          inventoryBlockers: 0
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
          expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
          quoteTurnaroundHours: 6,
          proposalViews: 3,
          jobReadinessRate: 82,
          paymentRiskAmount: 0,
          staffingGaps: 0,
          inventoryBlockers: 1
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
          expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
          quoteTurnaroundHours: 4,
          proposalViews: 5,
          jobReadinessRate: 91,
          paymentRiskAmount: 0,
          staffingGaps: 0,
          inventoryBlockers: 0
        }
      ]
    }
  ]
};

export const syntheticOperationalOutcomes: OperationalOutcomeSnapshot = {
  schemaVersion,
  capturedAt: new Date().toISOString(),
  period: 'trailing-90-days',
  source: 'synthetic',
  revenueInfluenced: 4_820_000,
  quotesAutomated: 3412,
  averageWinRate: 27.8,
  quoteTurnaroundHours: 0.7,
  averageResponseMinutes: 14,
  proposalViews: 728,
  jobReadinessRate: 82,
  paymentRiskAmount: 18_500,
  staffingGaps: 6,
  inventoryBlockers: 3
};

export const syntheticChampionCohorts: ChampionCohort[] = [
  {
    id: 'quote-speed-events',
    label: 'High-volume quoting teams',
    count: 18,
    averageScore: 86,
    primarySignals: ['High quote volume', 'Immediate timeline', 'Conversion visibility pain'],
    conversionRate: 31,
    averageRevenueInfluenced: 268_000,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'job-readiness-field-services',
    label: 'Readiness-driven operators',
    count: 11,
    averageScore: 79,
    primarySignals: ['Multi-location operations', 'Staffing risk', 'Job readiness gaps'],
    conversionRate: 24,
    averageRevenueInfluenced: 184_000,
    generatedAt: new Date().toISOString()
  }
];

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function budgetScore(budget: ContactSubmission['budget']) {
  if (budget === '75k-plus') {
    return 95;
  }
  if (budget === '25k-75k') {
    return 82;
  }
  if (budget === '10k-25k') {
    return 58;
  }
  return 35;
}

function timelineScore(timeline: ContactSubmission['timeline']) {
  if (timeline === 'immediate') {
    return 95;
  }
  if (timeline === '30-days') {
    return 84;
  }
  if (timeline === 'quarter') {
    return 64;
  }
  return 32;
}

function maturityScore(maturity: ChampionProfile['operationalMaturity']) {
  if (maturity === 'manual' || maturity === 'spreadsheet-led') {
    return 88;
  }
  if (maturity === 'tool-assisted') {
    return 74;
  }
  if (maturity === 'systematized') {
    return 58;
  }
  if (maturity === 'optimized') {
    return 42;
  }
  return 50;
}

export function deriveChampionProfile(submission: ContactSubmission): ChampionProfile {
  return championProfileSchema.parse({
    role: submission.decisionRole,
    industry: submission.industry,
    companySize: submission.companySize,
    locationCount: submission.locationCount,
    teamSize: submission.teamSize,
    monthlyQuoteVolume: submission.monthlyQuoteVolume,
    serviceCategory: submission.serviceCategory,
    currentTools: submission.currentTools,
    currentCrmOrOpsSystem: submission.currentCrmOrOpsSystem,
    operationalMaturity: submission.operationalMaturity,
    primaryBusinessPain: submission.primaryBusinessPain,
    topConstraint: submission.topConstraint
  });
}

export function deriveChampionScore(submission: ContactSubmission): ChampionScore {
  const profile = deriveChampionProfile(submission);
  const reasons: string[] = [];
  const quoteVolume = profile.monthlyQuoteVolume ?? 0;
  const teamSize = profile.teamSize ?? 0;
  const roleMultiplier = ['owner', 'executive', 'operations-leader', 'revenue-leader'].includes(profile.role) ? 1 : 0.78;
  const preferredCategory = ['hospitality', 'field-services', 'events', 'food-services'].includes(profile.serviceCategory);

  const fit = clampScore((preferredCategory ? 82 : 58) * roleMultiplier + Math.min(profile.locationCount, 20));
  const urgency = timelineScore(submission.timeline);
  const adoptionIntent = clampScore(45 + Math.min(quoteVolume, 120) * 0.28 + (profile.currentTools.length > 0 ? 12 : 0));
  const operationalComplexity = clampScore(
    maturityScore(profile.operationalMaturity) * 0.45 + Math.min(profile.locationCount * 7, 35) + Math.min(teamSize * 1.3, 28) + Math.min(quoteVolume * 0.18, 28)
  );
  const commercialReadiness = clampScore(budgetScore(submission.budget) * 0.72 + timelineScore(submission.timeline) * 0.28);
  const outcomePotential = clampScore(
    (['quote-speed', 'conversion-visibility', 'job-readiness', 'staffing-risk', 'payment-risk'].includes(profile.primaryBusinessPain) ? 76 : 52) +
      Math.min(quoteVolume * 0.14, 18) +
      Math.min(profile.locationCount * 2, 10)
  );

  if (preferredCategory) {
    reasons.push('Service operations category aligns with QuietPilot.');
  }
  if (profile.locationCount > 1) {
    reasons.push('Multi-location complexity raises coordination value.');
  }
  if (quoteVolume >= 25) {
    reasons.push('Quote volume can make automation impact measurable.');
  }
  if (submission.timeline === 'immediate' || submission.timeline === '30-days') {
    reasons.push('Near-term timeline signals urgency.');
  }
  if (submission.budget === '25k-75k' || submission.budget === '75k-plus') {
    reasons.push('Budget range supports a serious implementation path.');
  }
  if (profile.topConstraint !== 'none') {
    reasons.push(`Top constraint identified: ${profile.topConstraint}.`);
  }

  const total = clampScore(
    fit * 0.18 +
      urgency * 0.16 +
      adoptionIntent * 0.16 +
      operationalComplexity * 0.18 +
      commercialReadiness * 0.16 +
      outcomePotential * 0.16
  );

  return championScoreSchema.parse({
    total,
    fit,
    urgency,
    adoptionIntent,
    operationalComplexity,
    commercialReadiness,
    outcomePotential,
    reasons
  });
}
