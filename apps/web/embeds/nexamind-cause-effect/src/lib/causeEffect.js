const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value, digits = 0) => {
  const m = 10 ** digits;
  return Math.round(value * m) / m;
};

export const STAGES = [
  { id: "objective", label: "Objective", short: "Intent" },
  { id: "context", label: "Context", short: "Evidence" },
  { id: "reconsider", label: "Reconsider", short: "Alternatives" },
  { id: "simulate", label: "Simulate", short: "Consequences" },
  { id: "authority", label: "Authority Check", short: "Permission" },
  { id: "act", label: "Act", short: "Bounded action" },
  { id: "validate", label: "Validate", short: "Outcome" },
  { id: "memory", label: "Memory", short: "Learning" },
];

export const DEFAULT_SCENARIO = {
  discount: 15,
  contractMonths: 12,
  dealValue: 250000,
  evidenceCoverage: 8,
  requireHumanApproval: false,
};

const FACTS = {
  discount: {
    label: "Discount",
    format: (value) => `${value}%`,
    route: ["objective", "reconsider", "simulate", "authority", "validate"],
  },
  contractMonths: {
    label: "Contract",
    format: (value) => `${value} mo`,
    route: ["objective", "context", "simulate", "validate"],
  },
  dealValue: {
    label: "Deal value",
    format: (value) => `$${Math.round(value / 1000)}K`,
    route: ["objective", "simulate", "validate"],
  },
  evidenceCoverage: {
    label: "Evidence",
    format: (value) => `${value}/9`,
    route: ["context", "reconsider", "simulate", "authority", "validate"],
  },
  requireHumanApproval: {
    label: "Human approval",
    format: (value) => (value ? "Required" : "Optional"),
    route: ["authority", "act", "validate"],
  },
};

export function calculateOutcome(scenario) {
  const evidenceRatio = scenario.evidenceCoverage / 9;
  const discountPressure = clamp((scenario.discount - 10) / 15, 0, 1);
  const contractStrength = clamp((scenario.contractMonths - 6) / 18, 0, 1);
  const valueScale = clamp(scenario.dealValue / 250000, 0.2, 2);

  const confidence = clamp(
    64 +
      evidenceRatio * 29 +
      contractStrength * 4 -
      discountPressure * 9 +
      (scenario.requireHumanApproval ? 1 : 0),
    48,
    98
  );

  const baselineRisk = clamp(
    8 + discountPressure * 12 + (1 - evidenceRatio) * 10,
    7,
    28
  );

  const residualRisk = clamp(
    baselineRisk *
      (0.46 - evidenceRatio * 0.21) *
      (scenario.requireHumanApproval ? 0.78 : 1),
    1.5,
    13
  );

  const riskReduced = clamp(
    ((baselineRisk - residualRisk) / baselineRisk) * 100,
    5,
    94
  );

  const baseHours = 6.4;
  const simulatedHours = clamp(
    3.1 - evidenceRatio * 1.45 + discountPressure * 0.45,
    1.25,
    3.7
  );

  const marginDelta = clamp(
    8.1 -
      Math.max(scenario.discount - 12, 0) * 0.48 +
      evidenceRatio * 1.1 +
      contractStrength * 0.7,
    -2.5,
    9.5
  );

  const baselineMargin = 32;
  const simulatedMargin = baselineMargin + marginDelta;

  const baselineWin = 42;
  const simulatedWin = clamp(
    baselineWin +
      scenario.discount * 1.45 +
      contractStrength * 7 +
      evidenceRatio * 8,
    45,
    91
  );

  const revenueProtected = clamp(
    scenario.dealValue *
      (0.44 +
        contractStrength * 0.13 +
        evidenceRatio * 0.11 -
        scenario.discount / 175),
    0,
    scenario.dealValue * 0.8
  );

  const annualizedRevenue = scenario.dealValue * (12 / scenario.contractMonths);
  const simulatedRevenue = annualizedRevenue + revenueProtected;

  const directAuthority = scenario.discount <= 12;
  const conditionalAuthority =
    scenario.discount <= 18 &&
    residualRisk <= 6.2 &&
    scenario.evidenceCoverage >= 6;

  let recommendation = "Approve";
  let recommendationCode = "approve";
  let rationale =
    "Evidence quality and residual risk support direct approval inside the modeled authority boundary.";

  if (!conditionalAuthority || confidence < 72) {
    recommendation = "Escalate for Approval";
    recommendationCode = "escalate";
    rationale =
      "The modeled authority boundary is not satisfied. Escalate with the evidence and consequence package attached.";
  } else if (!directAuthority || scenario.requireHumanApproval || confidence < 89) {
    recommendation = "Approve with Conditions";
    recommendationCode = "conditional";
    rationale =
      "Proceed only with an explicit review checkpoint, margin guardrail, and evidence receipt before commitment.";
  }

  return {
    confidence: round(confidence),
    baselineRisk: round(baselineRisk, 1),
    residualRisk: round(residualRisk, 1),
    riskReduced: round(riskReduced),
    baseHours: round(baseHours, 1),
    simulatedHours: round(simulatedHours, 1),
    timeSaved: round(baseHours - simulatedHours, 1),
    baselineMargin,
    simulatedMargin: round(simulatedMargin, 1),
    marginDelta: round(marginDelta, 1),
    baselineWin,
    simulatedWin: round(simulatedWin),
    revenueProtected: round(revenueProtected),
    annualizedRevenue: round(annualizedRevenue),
    simulatedRevenue: round(simulatedRevenue),
    policyPass: conditionalAuthority,
    recommendation,
    recommendationCode,
    rationale,
    valueScale: round(valueScale, 2),
    evidenceCoverage: scenario.evidenceCoverage,
  };
}

function changedFacts(previous, next) {
  return Object.keys(FACTS)
    .filter((key) => previous[key] !== next[key])
    .map((key) => ({
      key,
      label: FACTS[key].label,
      from: previous[key],
      to: next[key],
      fromLabel: FACTS[key].format(previous[key]),
      toLabel: FACTS[key].format(next[key]),
      route: FACTS[key].route,
    }));
}

function metricDelta(label, previous, next, formatter, direction = "neutral") {
  const delta = next - previous;
  return {
    label,
    previous,
    next,
    delta,
    direction,
    text:
      Math.abs(delta) < 0.001
        ? "No material change"
        : `${delta > 0 ? "+" : ""}${formatter(delta)}`,
    before: formatter(previous),
    after: formatter(next),
  };
}

export function buildCauseEffect(previousScenario, nextScenario) {
  const before = calculateOutcome(previousScenario);
  const after = calculateOutcome(nextScenario);
  const facts = changedFacts(previousScenario, nextScenario);

  const impactedSet = new Set();
  facts.forEach((fact) => fact.route.forEach((stage) => impactedSet.add(stage)));
  if (facts.length > 0) impactedSet.add("memory");

  const impactedStages = STAGES
    .map((stage) => stage.id)
    .filter((stage) => impactedSet.has(stage));

  const metrics = [
    metricDelta("Confidence", before.confidence, after.confidence, (v) => `${round(v)} pts`),
    metricDelta("Residual risk", before.residualRisk, after.residualRisk, (v) => `${round(v, 1)} pts`),
    metricDelta("Margin", before.simulatedMargin, after.simulatedMargin, (v) => `${round(v, 1)} pts`),
    metricDelta("Win probability", before.simulatedWin, after.simulatedWin, (v) => `${round(v)} pts`),
    metricDelta("Revenue protected", before.revenueProtected, after.revenueProtected, (v) => `$${Math.round(v / 1000)}K`),
  ];

  const changedMetrics = metrics.filter((metric) => Math.abs(metric.delta) >= 0.05);

  const stageMessages = {
    objective:
      facts.find((f) => ["discount", "contractMonths", "dealValue"].includes(f.key))
        ? `Commercial intent changed: ${facts
            .filter((f) => ["discount", "contractMonths", "dealValue"].includes(f.key))
            .map((f) => `${f.label} ${f.fromLabel} → ${f.toLabel}`)
            .join(" · ")}`
        : "Intent unchanged.",
    context:
      facts.some((f) => f.key === "evidenceCoverage")
        ? `Evidence set changed to ${nextScenario.evidenceCoverage}/9 validated sources.`
        : `Context re-read for a ${nextScenario.contractMonths}-month decision horizon.`,
    reconsider:
      `Alternatives re-ranked with ${after.confidence}% confidence and ${after.residualRisk}% residual risk.`,
    simulate:
      `Projected margin ${after.simulatedMargin}% · win probability ${after.simulatedWin}% · protected value $${Math.round(after.revenueProtected / 1000)}K.`,
    authority:
      after.policyPass
        ? `Authority boundary passes at ${after.residualRisk}% residual risk.`
        : `Authority boundary fails: ${after.residualRisk}% residual risk or insufficient evidence.`,
    act:
      `Permitted next action: ${after.recommendation}.`,
    validate:
      `Validated against confidence ${after.confidence}% and risk ${after.residualRisk}%.`,
    memory:
      `Trace captured: ${facts.length} fact${facts.length === 1 ? "" : "s"} changed, ${changedMetrics.length} downstream metric${changedMetrics.length === 1 ? "" : "s"} moved.`,
  };

  const recommendationChanged =
    before.recommendationCode !== after.recommendationCode;

  if (recommendationChanged && !impactedStages.includes("act")) {
    const authorityIndex = impactedStages.indexOf("authority");
    const insertAt = authorityIndex >= 0 ? authorityIndex + 1 : impactedStages.length;
    impactedStages.splice(insertAt, 0, "act");
  }

  let severity = "low";
  if (recommendationChanged || !after.policyPass) severity = "high";
  else if (facts.length >= 2 || changedMetrics.some((m) => Math.abs(m.delta) > 5))
    severity = "medium";

  return {
    before,
    after,
    facts,
    impactedStages,
    changedMetrics,
    stageMessages,
    recommendationChanged,
    recommendationTransition: `${before.recommendation} → ${after.recommendation}`,
    severity,
  };
}
