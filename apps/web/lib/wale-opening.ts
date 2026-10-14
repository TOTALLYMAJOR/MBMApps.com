export const WALE_ARCHIVE_SRC = '/wale-archive/index.html?quality=cinema';

export function waleOpeningTiming(reducedMotion: boolean) {
  return reducedMotion
    ? { holdMs: 0, fadeSeconds: 0.12 }
    : { holdMs: 2_600, fadeSeconds: 0.72 };
}

export function canRevealWale({
  minimumElapsed,
  visitorAdvanced
}: {
  minimumElapsed: boolean;
  visitorAdvanced: boolean;
}) {
  return visitorAdvanced || minimumElapsed;
}
