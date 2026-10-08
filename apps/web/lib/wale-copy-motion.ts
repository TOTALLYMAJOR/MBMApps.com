const ease = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** Fade from the block's reading position, before its heading clips at the top. */
export function chapterCopyOpacity(top: number, restingTop: number, viewport: number) {
  const h = Math.max(1, viewport);
  const readingTop = Math.min(restingTop, h * 0.45);
  return ease((top - readingTop + h * 0.28) / (h * 0.28))
    * (1 - ease((top / h - 0.78) / 0.22));
}

/** A cue belongs near the bottom of the viewport, not the start of a long section. */
export function scrollCueOpacity(top: number, viewport: number) {
  const position = top / Math.max(1, viewport);
  return ease((position - 0.66) / 0.14) * (1 - ease((position - 0.92) / 0.07));
}
