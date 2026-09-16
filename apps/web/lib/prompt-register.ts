export type PromptRecipe = {
  id: number;
  category: string;
  title: string;
  input: string;
  chain: string;
  output: string;
  prompt: string;
};

const groups: Record<string, Array<[string, string, string, string]>> = {
  "Reference → UI": [
    ["Website to original UI", "URL", "Aura + screenshot", "new interface"], ["Three sites to one system", "URLs", "Aura + prompt", "coherent design"], ["Competitor teardown", "URL", "ChatGPT + Aura", "original redesign"], ["Hero remix", "screenshot", "Aura template", "new hero"], ["Responsive reconstruction", "screenshots", "v0", "responsive code"], ["Brand removal pass", "URL", "AI critique + Aura", "unbranded template"], ["Conversion-path rebuild", "URL", "AI journey map + v0", "focused landing page"], ["Accessibility reconstruction", "URL", "AI audit + code", "accessible UI"], ["Motion extraction", "URL", "visual analysis + Aura", "one signature interaction"], ["Reference-to-case-study", "URL + iterations", "AI editor", "design narrative"]
  ],
  "Aura → code": [
    ["Template composition", "@hero + @pricing", "Aura", "unified page"], ["Prompt-targeted restyle", "Aura page", "Aura", "new visual system"], ["Copy replacement engine", "template + audience", "Aura", "new messaging"], ["Three visual directions", "one template", "Aura", "A/B/C concepts"], ["Token extraction", "Aura design", "AI + markdown", "design.md"], ["Code export cleanup", "Aura HTML/CSS", "coding agent", "React components"], ["Aura to Figma handoff", "Aura design", "Aura + Figma", "editable design file"], ["Component library remix", "Aura components", "Aura", "product UI kit"], ["Template state expansion", "Aura page", "AI + Aura", "empty/loading/error states"], ["Design critique loop", "Aura preview", "AI evaluator", "prioritized revisions"]
  ],
  "Screenshot → code": [
    ["Screenshot to React", "screenshot", "v0", "React UI"], ["Mobile to desktop", "mobile screenshot", "v0", "responsive layout"], ["Screenshot to tokens", "screenshot", "vision model", "CSS variables"], ["Visual state inference", "screenshot", "AI analyst", "state inventory"], ["Screenshot accessibility pass", "screenshot", "AI + code", "accessible UI"], ["Screenshot to component map", "screenshot", "AI analyst", "component contract"], ["Screenshot diff repair", "two screenshots", "AI evaluator", "fix list"], ["Sketch to prototype", "wireframe", "v0", "working prototype"], ["Screenshot to design rationale", "screenshot", "AI editor", "design.md"], ["Screenshot to test plan", "screenshot", "AI QA", "visual test cases"]
  ],
  "Figma → product": [
    ["Figma screen to app", "Figma", "v0", "working component"], ["Figma flow to prototype", "Figma flow", "Lovable", "clickable app"], ["Figma tokens to Tailwind", "design system", "coding agent", "theme"], ["Prototype to user stories", "Figma flow", "AI analyst", "stories + criteria"], ["Variants to state machine", "Figma variants", "AI architect", "behavior spec"], ["Figma to Storybook", "components", "AI + code", "component docs"], ["Figma to test matrix", "flow", "AI QA", "acceptance tests"], ["Figma to copy system", "screens", "AI writer", "content model"], ["Figma to UX critique", "file", "AI evaluator", "friction report"], ["Design handoff pack", "Figma + notes", "AI editor", "design.md + README"]
  ],
  "Codebase → design": [
    ["Repository to design.md", "repo", "coding agent", "design documentation"], ["Duplicate component hunt", "repo", "AI code search", "consolidation plan"], ["CSS to token system", "CSS", "AI + code", "token file"], ["Route map generator", "repo", "AI analyst", "navigation map"], ["UI behavior inventory", "repo + browser", "AI analyst", "state catalog"], ["Component contract writer", "components", "AI editor", "usage contracts"], ["Visual regression baseline", "routes", "browser + AI", "screenshot suite"], ["Architecture showcase", "repo", "AI storyteller", "walkthrough"], ["Design drift detector", "repo + reference", "AI evaluator", "drift report"], ["Refactor brief", "repo", "AI architect", "bounded plan"]
  ],
  "Docs → interface": [
    ["Policy to dashboard", "policy", "AI + v0", "rule dashboard"], ["Meeting notes to board", "transcript", "AI + app builder", "project board"], ["Research to evidence portal", "report", "AI + Aura", "source-backed UI"], ["Interview to feedback app", "calls", "AI + Lovable", "feedback explorer"], ["PDF to docs site", "PDF", "AI + Bolt", "documentation site"], ["Requirements to prototype", "PRD", "AI + v0", "product prototype"], ["Contract to obligation tracker", "contract", "AI + app builder", "deadline UI"], ["Manual to learning app", "manual", "AI + Lovable", "interactive course"], ["Job description to recruiter UI", "JD", "AI + Aura", "candidate workflow"], ["Notes to decision register", "notes", "AI + markdown", "decision log"]
  ],
  "Data → experience": [
    ["CSV to analytics UI", "CSV", "AI + v0", "dashboard"], ["Survey to theme explorer", "responses", "AI + code", "research UI"], ["Sales data to pipeline", "CSV", "AI + app builder", "pipeline"], ["Stream data to cockpit", "analytics", "AI + Aura", "creator dashboard"], ["API to admin UI", "schema", "AI + v0", "admin surface"], ["Metric to narrative", "metrics", "AI analyst", "executive brief"], ["Anomaly to investigation flow", "time series", "AI + app builder", "diagnostic UI"], ["Data dictionary generator", "dataset", "AI + structured output", "schema docs"], ["Two tables to join UI", "tables", "AI analyst", "join plan"], ["Data to scenario planner", "dataset", "AI + code", "what-if tool"]
  ],
  "AI → AI": [
    ["Research to visual design", "research brief", "ChatGPT + Aura", "landing page"], ["Aura to coding agent", "exported code", "Aura + agent", "refactored app"], ["v0 to GitHub QA", "v0 app", "GitHub + agent", "tested code"], ["Project-to-project reuse", "existing app", "Lovable references", "shared system"], ["Critique to visual revision", "AI review", "AI + v0", "targeted polish"], ["Copy to content model", "copy deck", "AI + app builder", "content-driven UI"], ["Architecture to component", "architecture note", "AI + v0", "component scaffold"], ["Evaluator to browser test", "rubric", "AI + browser", "QA report"], ["Generator to breaker", "generated app", "second AI agent", "failure report"], ["Prompt to case study", "prompt history", "AI editor", "public walkthrough"]
  ],
  "Live / creator": [
    ["Live prompt to landing page", "viewer idea", "AI + Aura", "on-stream design"], ["Guest interview to app brief", "conversation", "AI transcription", "build brief"], ["Pilates session to safe layout", "camera plan", "AI design critique", "scene layout"], ["Stream question to prototype", "chat question", "AI + v0", "live prototype"], ["Audience vote to redesign", "poll + UI", "AI + Aura", "selected variant"], ["Live website teardown", "URL", "browser + AI", "visual critique"], ["Build failure to lesson", "error log", "AI analyst", "teachable breakdown"], ["Stream transcript to clips", "VOD transcript", "AI editor", "clip queue"], ["Viewer challenge to workflow", "chat", "AI planner", "experiment plan"], ["Episode to reusable recipe", "recording + prompts", "AI editor", "register entry"]
  ],
  "Safety / evaluation": [
    ["Prompt injection demo", "hostile document", "AI + sandbox", "attack report"], ["Reference rights check", "asset set", "AI checklist", "permission log"], ["AI answer verifier", "answer + sources", "AI evaluator", "confidence score"], ["Generated UI accessibility test", "prototype", "browser + AI", "a11y findings"], ["Tool permission review", "agent tools", "AI security", "approval matrix"], ["Golden prompt suite", "prompt set", "AI evals", "regression report"], ["Human versus AI decision", "same problem", "two reviewers", "difference map"], ["Model comparison lab", "one task", "multiple models", "scorecard"], ["Privacy boundary review", "workflow", "AI safety reviewer", "data-handling plan"], ["Output provenance pack", "generated artifact", "AI editor", "source + change log"]
  ]
};

let id = 1;
export const promptRecipes: PromptRecipe[] = Object.entries(groups).flatMap(([category, items]) => items.map(([title, input, chain, output]) => ({
  id: id++, category, title, input, chain, output,
  prompt: `You are the production lead for this workflow: ${title}.\n\nINPUT\nUse this ${input} as the source of truth: [PASTE OR ATTACH INPUT]\n\nTASK\nRun the workflow through ${chain}. Preserve the useful intent, but create an original result for this audience: [AUDIENCE].\n\nCONSTRAINTS\n- Do not copy branding, proprietary copy, or protected assets.\n- Separate observed facts from inference.\n- Make loading, empty, error, and success states explicit.\n- Prefer a small, coherent system over decoration.\n\nOUTPUT\nCreate ${output}, then return the artifact, design decisions, assumptions, unknowns, and a concise design.md with tokens, components, states, and next validation steps.`
})));

export const promptRecipeCategories = ["All", ...Object.keys(groups)];
