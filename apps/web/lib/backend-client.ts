import {
  championCohortsResponseSchema,
  demoMetricsResponseSchema,
  demoPipelineResponseSchema,
  operationalOutcomeResponseSchema,
  syntheticChampionCohorts,
  syntheticMetrics,
  syntheticOperationalOutcomes,
  syntheticPipeline,
  type ChampionCohort,
  type DemoMetric,
  type OperationalOutcomeSnapshot,
  type PipelineSnapshot
} from '@mbm/contracts';

type FetchOutcome<T> = {
  data: T;
  fallback: boolean;
};

function backendBaseUrl() {
  return process.env.BACKEND_API_URL ?? 'http://localhost:4000';
}

async function fetchJson<T>(input: string, schema: { parse: (value: unknown) => T }, timeoutMs = 3500): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    return schema.parse(payload);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getDemoMetrics(): Promise<FetchOutcome<DemoMetric[]>> {
  try {
    const payload = await fetchJson(`${backendBaseUrl()}/v1/demo/metrics`, demoMetricsResponseSchema);
    return { data: payload.metrics, fallback: false };
  } catch {
    return { data: syntheticMetrics, fallback: true };
  }
}

export async function getDemoPipeline(): Promise<FetchOutcome<PipelineSnapshot>> {
  try {
    const payload = await fetchJson(`${backendBaseUrl()}/v1/demo/pipeline`, demoPipelineResponseSchema);
    return { data: payload.pipeline, fallback: false };
  } catch {
    return {
      data: {
        ...syntheticPipeline,
        generatedAt: new Date().toISOString()
      },
      fallback: true
    };
  }
}

export async function getOperationalOutcomes(): Promise<FetchOutcome<OperationalOutcomeSnapshot>> {
  try {
    const payload = await fetchJson(`${backendBaseUrl()}/v1/demo/outcomes`, operationalOutcomeResponseSchema);
    return { data: payload.outcomes, fallback: false };
  } catch {
    return {
      data: {
        ...syntheticOperationalOutcomes,
        capturedAt: new Date().toISOString()
      },
      fallback: true
    };
  }
}

export async function getChampionCohorts(): Promise<FetchOutcome<ChampionCohort[]>> {
  try {
    const payload = await fetchJson(`${backendBaseUrl()}/v1/champion/cohorts`, championCohortsResponseSchema);
    return { data: payload.cohorts, fallback: false };
  } catch {
    return { data: syntheticChampionCohorts, fallback: true };
  }
}
