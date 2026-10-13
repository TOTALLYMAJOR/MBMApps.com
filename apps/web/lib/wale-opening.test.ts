import { describe, expect, it } from 'vitest';
import { canRevealWale, WALE_ARCHIVE_SRC, waleOpeningTiming } from './wale-opening';

describe('Wale opening sequence', () => {
  it('preloads the Living Archive at Cinema quality before an automatic handoff', () => {
    expect(WALE_ARCHIVE_SRC).toBe('/wale-archive/index.html?quality=cinema');
    expect(waleOpeningTiming(false)).toEqual({ holdMs: 2_600, fadeSeconds: 0.72 });
  });

  it('removes the hold and shortens the handoff for reduced-motion visitors', () => {
    expect(waleOpeningTiming(true)).toEqual({ holdMs: 0, fadeSeconds: 0.12 });
  });

  it('keeps the automatic handoff time-bounded even when Cinema is still preparing', () => {
    expect(canRevealWale({ minimumElapsed: true, visitorAdvanced: false })).toBe(true);
    expect(canRevealWale({ minimumElapsed: false, visitorAdvanced: false })).toBe(false);
    expect(canRevealWale({ minimumElapsed: false, visitorAdvanced: true })).toBe(true);
  });
});
