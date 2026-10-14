export type MasterScFactionId = 'forge' | 'prism' | 'tide';
export type MasterScSupply = 20 | 60;
export type MasterScCommandId = 'scout' | 'stabilize' | 'pressure' | 'expand' | 'reset' | 'review';

export const masterScFactions = [
  {
    id: 'forge',
    label: 'Forge',
    designation: 'Measured force',
    doctrine: 'Stabilize the opening, then turn production clarity into controlled pressure.',
    operation: 'Anchor Shift',
    telemetry: { focus: 'Production', signal: 'Stable', cadence: '52 APM' }
  },
  {
    id: 'prism',
    label: 'Prism',
    designation: 'Protected timing',
    doctrine: 'Protect the information advantage and commit only when the timing is supported.',
    operation: 'Signal Window',
    telemetry: { focus: 'Positioning', signal: 'Watching', cadence: '48 APM' }
  },
  {
    id: 'tide',
    label: 'Tide',
    designation: 'Adaptive tempo',
    doctrine: 'Use repeated scouting cycles to keep expansion and pressure in the same rhythm.',
    operation: 'Wide Current',
    telemetry: { focus: 'Economy', signal: 'Growing', cadence: '57 APM' }
  }
] as const;

export const masterScCheckpoints = [
  {
    supply: 20,
    label: 'Opening checkpoint',
    objective: 'Confirm the first production cycle before adding complexity.',
    cue: 'Read worker count, production uptime, and first scouting evidence together.',
    response: 'Hold the next commitment until the three signals agree.'
  },
  {
    supply: 60,
    label: 'Midgame checkpoint',
    objective: 'Convert the opening plan into a repeatable information loop.',
    cue: 'Compare army position, replacement capacity, and the latest opponent signal.',
    response: 'Choose one bounded move: pressure, expand, or reset the formation.'
  }
] as const;

export const masterScCommands = [
  { id: 'scout', label: 'Scout', detail: 'Refresh the evidence before changing the plan.' },
  { id: 'stabilize', label: 'Stabilize', detail: 'Protect production and reduce avoidable exposure.' },
  { id: 'pressure', label: 'Pressure', detail: 'Test the opponent with a bounded, recoverable move.' },
  { id: 'expand', label: 'Expand', detail: 'Add capacity only when the information window supports it.' },
  { id: 'reset', label: 'Reset', detail: 'Return to a coherent formation before the next decision.' },
  { id: 'review', label: 'Review', detail: 'Compare the intended sequence with the observed replay.' }
] as const;

export function getMasterScView(
  factionId: MasterScFactionId,
  supply: MasterScSupply,
  commandId: MasterScCommandId
) {
  return {
    faction: masterScFactions.find((faction) => faction.id === factionId) ?? masterScFactions[0],
    checkpoint: masterScCheckpoints.find((checkpoint) => checkpoint.supply === supply) ?? masterScCheckpoints[0],
    command: masterScCommands.find((command) => command.id === commandId) ?? masterScCommands[0]
  };
}
