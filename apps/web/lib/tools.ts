export type ToolCategory = 'Design' | 'Production' | 'Reasoning' | 'Simulation';

export type ToolRecord = {
  id: string;
  name: string;
  category: ToolCategory;
  command: string;
  description: string;
  href: string;
  preview: string;
  previewAlt: string;
  meta: string;
  accessDescription: string;
  featured?: boolean;
};

export const tools: [ToolRecord, ...ToolRecord[]] = [
  {
    id: 'component-studio',
    name: 'Component Studio',
    category: 'Design',
    command: 'launch --utility component-studio@4',
    description: 'Browse, tune, and compose interface components into an implementation-ready design pack.',
    href: '/component-studio.html',
    preview: '/tools/component-studio.png',
    previewAlt: 'Component Studio showing its component catalog and visual direction controls.',
    meta: '150 components · browser-local state',
    accessDescription: 'Runs locally in the browser',
    featured: true
  },
  {
    id: 'prompt-register',
    name: 'AI Production Prompt Register',
    category: 'Production',
    command: 'launch --utility prompt-register@1',
    description: 'Search production workflows that turn source material into interfaces, code, and design records.',
    href: '/tools/prompt-register',
    preview: '/tools/prompt-register-signal-lattice.png',
    previewAlt: 'AI Production Prompt Register signal lattice showing connected production workflow families.',
    meta: '100 recipes · searchable · JSON export',
    accessDescription: 'Curated production reference'
  },
  {
    id: 'cognitive-strategy',
    name: 'Cognitive Strategy Utility',
    category: 'Reasoning',
    command: 'launch --utility cognitive-strategy@1',
    description: 'Choose among 42 reasoning strategies and compile context, goals, evidence rules, and authority boundaries into a reusable prompt.',
    href: '/cognitive-strategy-utility/index.html',
    preview: '/tools/cognitive-strategy-utility.png',
    previewAlt: 'Cognitive Strategy Utility with context, strategy selection, and compiled prompt panels.',
    meta: '42 strategies · local storage · JSON export',
    accessDescription: 'No network requests'
  },
  {
    id: 'agentic-decision-lab',
    name: 'Agentic Decision Lab',
    category: 'Simulation',
    command: 'launch --simulator nexamind/agentic-decision-lab',
    description: 'Change scenario facts and inspect how authority, recommendations, and proof move through a bounded decision system.',
    href: '/nexamind-agentic-demo/index.html',
    preview: '/tools/agentic-decision-lab.png',
    previewAlt: 'Agentic Decision Lab showing an interactive scenario and governed decision flow.',
    meta: 'Interactive simulator · browser-only state',
    accessDescription: 'Sample scenarios only'
  },
  {
    id: 'cause-effect-lab',
    name: 'Cause & Effect Lab',
    category: 'Simulation',
    command: 'launch --simulator nexamind/cause-effect@2',
    description: 'Trace a scenario fact through its causal route, authority result, recommendation transition, and memory receipt.',
    href: '/nexamind-cause-effect/index.html',
    preview: '/tools/cause-effect-lab.png',
    previewAlt: 'Cause and Effect Lab visualizing a fact-to-decision causal route.',
    meta: 'Deterministic lab · browser-only state',
    accessDescription: 'Sample scenarios only'
  }
];

export const toolCategories = [...new Set(tools.map((tool) => tool.category))];
