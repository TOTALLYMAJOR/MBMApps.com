export const QUALITY = {
  light: {
    simulationSize: 96,
    membraneSegments: 64,
    membraneAcross: 10,
    nucleusSegments: 56,
    traceSegments: 150,
    volumeSamples: 20,
    volumeScale: 0.30,
    dofSamples: 16,
    pixelBudget: 1100000,
    maxDPR: 1.15
  },

  studio: {
    simulationSize: 160,
    membraneSegments: 110,
    membraneAcross: 16,
    nucleusSegments: 88,
    traceSegments: 220,
    volumeSamples: 28,
    volumeScale: 0.38,
    dofSamples: 24,
    pixelBudget: 2000000,
    maxDPR: 1.5
  },

  cinema: {
    simulationSize: 256,
    membraneSegments: 150,
    membraneAcross: 22,
    nucleusSegments: 120,
    traceSegments: 300,
    volumeSamples: 36,
    volumeScale: 0.45,
    dofSamples: 32,
    pixelBudget: 3200000,
    maxDPR: 1.8
  }
};

export const DEFAULTS = {
  exposure: 0.96,
  bloom: 0.43,
  fog: 0.64,
  turbulence: 0.64,
  speed: 0.75,
  chroma: 0.65,
  pointer: 0.38,
  aperture: 22,
  grain: 0.006
};

export const CONTROLS = [
  {
    key: "exposure",
    label: "Exposure",
    min: 0.55,
    max: 1.45,
    step: 0.01
  },
  {
    key: "bloom",
    label: "Light diffusion",
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    key: "fog",
    label: "Atmosphere density",
    min: 0,
    max: 1.4,
    step: 0.01
  },
  {
    key: "turbulence",
    label: "Field turbulence",
    min: 0,
    max: 1.6,
    step: 0.01
  },
  {
    key: "speed",
    label: "Temporal pace",
    min: 0.15,
    max: 1.6,
    step: 0.01
  },
  {
    key: "chroma",
    label: "Chromatic presence",
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    key: "pointer",
    label: "Pointer influence",
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    key: "aperture",
    label: "Depth separation",
    min: 0,
    max: 42,
    step: 1
  },
  {
    key: "grain",
    label: "Film grain",
    min: 0,
    max: 0.018,
    step: 0.001
  }
];

export const ACTS = [
  {
    id: "discover",
    name: "Discovery",
    accent: "#aebccd",
    distance: 1.07,
    yaw: -0.12
  },
  {
    id: "hypothesize",
    name: "Association",
    accent: "#b9c6d2",
    distance: 0.99,
    yaw: 0.04
  },
  {
    id: "evaluate",
    name: "Evaluation",
    accent: "#b5becf",
    distance: 1.02,
    yaw: 0.13
  },
  {
    id: "integrate",
    name: "Integration",
    accent: "#81c2b0",
    distance: 0.95,
    yaw: -0.04
  },
  {
    id: "evolve",
    name: "Emergence",
    accent: "#b3ddc9",
    distance: 1.03,
    yaw: 0.02
  }
];

export const SPECIMENS = [
  {
    id: "S—01",
    name: "Context compression",
    accepted: true,
    summary:
      "A candidate for preserving useful context while reducing repetition.",
    origin:
      "Repeated context fragments across development sessions.",
    evidence:
      "Task fidelity, omission analysis, and comparison against an unchanged baseline.",
    contract:
      "Integrate only where essential constraints and provenance remain recoverable."
  },
  {
    id: "S—02",
    name: "Test synthesis",
    accepted: true,
    summary:
      "A candidate for turning observed failures into targeted regression tests.",
    origin:
      "Failure traces and previously corrected defects.",
    evidence:
      "Fault detection, test validity, and resistance to overfitting.",
    contract:
      "Require executable tests and a clear relationship to the behavior under review."
  },
  {
    id: "S—03",
    name: "Patch ranking",
    accepted: false,
    summary:
      "A candidate for choosing between multiple plausible code changes.",
    origin:
      "Alternative patches proposed for the same development task.",
    evidence:
      "Correctness, unintended behavior, and performance across held-out tasks.",
    contract:
      "Defer when preference signals are stronger than the correctness evidence."
  },
  {
    id: "S—04",
    name: "Dependency mapping",
    accepted: true,
    summary:
      "A candidate for tracing the consequences of changes across a codebase.",
    origin:
      "Imports, call relationships, configuration, and build structure.",
    evidence:
      "Coverage of affected components and verification against actual behavior.",
    contract:
      "Expose uncertainty where static relationships do not establish runtime impact."
  },
  {
    id: "S—05",
    name: "Failure clustering",
    accepted: false,
    summary:
      "A candidate for finding shared causes among apparently unrelated failures.",
    origin:
      "Exception records, failed checks, and repeated repair attempts.",
    evidence:
      "Cluster stability and confirmation that similar symptoms share a cause.",
    contract:
      "Do not integrate a causal explanation based only on visual similarity."
  },
  {
    id: "S—06",
    name: "Runtime observability",
    accepted: true,
    summary:
      "A candidate for making the consequences of generated changes easier to inspect.",
    origin:
      "Execution traces, instrumentation, and behavioral observations.",
    evidence:
      "Diagnostic usefulness, overhead, and appropriate treatment of sensitive data.",
    contract:
      "Preserve reviewability without collecting more information than the task requires."
  }
];

export function chooseQuality() {
  const requested = new URLSearchParams(location.search).get("quality");

  if (Object.prototype.hasOwnProperty.call(QUALITY, requested)) {
    return requested;
  }

  return innerWidth <= 850 ? "light" : "studio";
}

export function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function smoothstep(value, minimum, maximum) {
  const t = clamp((value - minimum) / (maximum - minimum), 0, 1);
  return t * t * (3 - 2 * t);
}

export function mix(a, b, t) {
  return a + (b - a) * t;
}