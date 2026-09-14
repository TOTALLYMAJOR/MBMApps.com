export const USE_CASES = {
  pricing: {
    label: "Pricing Change",
    description: "Evaluate and approve a customer pricing change request.",
    defaultObjective:
      "Approve a 15% discount for a strategic customer to win a 12-month contract, while staying within policy and margin targets.",
  },
  staffing: {
    label: "Staffing Change",
    description: "Evaluate staffing coverage, cost, and service-level impact.",
    defaultObjective:
      "Cover a high-demand event window without exceeding labor targets or creating unacceptable service risk.",
  },
  inventory: {
    label: "Inventory Substitution",
    description: "Evaluate substitutions when an item becomes constrained.",
    defaultObjective:
      "Find the safest substitute for a constrained item while protecting margin, customer expectations, and operational readiness.",
  },
  quote: {
    label: "Quote Revision",
    description: "Assess a commercial quote amendment before committing it.",
    defaultObjective:
      "Revise a customer quote based on new scope without violating approval policy, margin targets, or fulfillment constraints.",
  },
};

export const EVIDENCE_SOURCES = [
  { id: "crm", label: "CRM", system: "Salesforce", detail: "Customer history · 12 similar deals", confidence: 98, status: "verified", age: "2 min ago" },
  { id: "finance", label: "Finance", system: "NetSuite", detail: "Margin analysis and P&L impact", confidence: 96, status: "verified", age: "3 min ago" },
  { id: "market", label: "Market", system: "Gartner", detail: "Industry benchmarks and competitive context", confidence: 89, status: "verified", age: "5 min ago" },
  { id: "legal", label: "Legal", system: "Internal Policy", detail: "Discount approval guidelines", confidence: 100, status: "verified", age: "4 min ago" },
  { id: "web", label: "Web", system: "PWC Report", detail: "Market trends and external signals", confidence: 92, status: "verified", age: "6 min ago" },
  { id: "regional", label: "Regional", system: "Exception Registry", detail: "EU market rule conflict requires review", confidence: 72, status: "open", age: "8 min ago" },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round = (v, digits = 0) => {
  const m = 10 ** digits;
  return Math.round(v * m) / m;
};

export function calculateOutcome(s) {
  const contextCount =
    Number(s.includeHistory) +
    Number(s.includeCompetitive) +
    Number(s.runFinancial);

  const discountPressure = clamp((s.discount - 10) / 15, 0, 1);
  const contractStrength = clamp((s.contractMonths - 6) / 18, 0, 1);

  const evidenceCoverage = 5 + contextCount;
  const confidence = clamp(
    74 + contextCount * 5 + contractStrength * 4 - discountPressure * 6 -
      (s.requireHumanApproval ? 1 : 0),
    65,
    97
  );

  const baselineRisk = clamp(8 + discountPressure * 10, 8, 18);
  const residualRisk = clamp(
    baselineRisk * (0.42 - contextCount * 0.06) *
      (s.requireHumanApproval ? 0.84 : 1),
    1.6,
    8.5
  );
  const riskReduced = clamp(
    ((baselineRisk - residualRisk) / baselineRisk) * 100,
    20,
    90
  );

  const baselineHours = 6.2 + discountPressure * 1.1;
  const simulatedHours = clamp(
    2.5 - contextCount * 0.3 - (s.runFinancial ? 0.2 : 0) +
      discountPressure * 0.3,
    1.2,
    3.1
  );

  const retainedFraction = clamp(
    0.54 + contractStrength * 0.12 + contextCount * 0.03 - s.discount / 130,
    0.34,
    0.72
  );
  const revenueProtected = s.dealValue * retainedFraction;

  const baselineMargin = 32;
  const marginDelta = clamp(
    7.8 - Math.max(s.discount - 12, 0) * 0.42 +
      contextCount * 0.28 + contractStrength * 0.8,
    1.2,
    8.5
  );

  const baselineWin = clamp(35 + contractStrength * 10, 35, 48);
  const simulatedWin = clamp(
    baselineWin + s.discount * 1.65 + contextCount * 3,
    baselineWin + 8,
    88
  );

  const annualizedRevenue = s.dealValue * (12 / s.contractMonths);

  let recommendation = "Approve";
  let rationale =
    "The modeled outcome is inside policy and the evidence set supports direct approval.";

  if (s.discount > 18 || residualRisk > 6.2) {
    recommendation = "Escalate for Approval";
    rationale =
      "The requested discount or residual risk crosses the direct-approval boundary. Escalate with the evidence package attached.";
  } else if (s.discount > 12 || s.requireHumanApproval || confidence < 88) {
    recommendation = "Approve with Conditions";
    rationale =
      "Approve with a review checkpoint, margin guardrail, and explicit evidence receipt before commitment.";
  }

  return {
    evidenceCoverage,
    confidence: round(confidence),
    baselineRisk: round(baselineRisk, 1),
    residualRisk: round(residualRisk, 1),
    riskReduced: round(riskReduced),
    baselineHours: round(baselineHours, 1),
    simulatedHours: round(simulatedHours, 1),
    timeSaved: round(baselineHours - simulatedHours, 1),
    revenueProtected: round(revenueProtected),
    baselineMargin,
    simulatedMargin: round(baselineMargin + marginDelta, 1),
    marginDelta: round(marginDelta, 1),
    baselineWin: round(baselineWin),
    simulatedWin: round(simulatedWin),
    annualizedRevenue: round(annualizedRevenue),
    simulatedRevenue: round(annualizedRevenue + revenueProtected),
    recommendation,
    rationale,
    policyPass: residualRisk <= 6.2,
  };
}

export function buildScenarioVariants(base) {
  return [
    { id: "conservative", label: "Conservative", outcome: calculateOutcome({ ...base, discount: Math.max(5, base.discount - 5) }) },
    { id: "balanced", label: "Balanced", outcome: calculateOutcome(base) },
    { id: "aggressive", label: "Aggressive", outcome: calculateOutcome({ ...base, discount: Math.min(30, base.discount + 5) }) },
  ];
}
