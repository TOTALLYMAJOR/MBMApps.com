import { describe, expect, it } from 'vitest';
import { chapterCopyOpacity, scrollCueOpacity } from './wale-copy-motion';

describe('chapter copy scroll fade', () => {
  it('holds the reading zone at full opacity and hides outside it', () => {
    expect(chapterCopyOpacity(145, 145, 1000)).toBe(1);
    expect(chapterCopyOpacity(600, 145, 1000)).toBe(1);
    expect(chapterCopyOpacity(-135, 145, 1000)).toBe(0);
    expect(chapterCopyOpacity(1000, 145, 1000)).toBe(0);
  });
  it('eases at both boundaries and reverses without time or direction state', () => {
    expect(chapterCopyOpacity(5, 145, 1000)).toBeCloseTo(0.5);
    expect(chapterCopyOpacity(890, 145, 1000)).toBeCloseTo(0.5);
    const positions = [1000, 890, 600, 145, 5, -135];
    const down = positions.map(top => chapterCopyOpacity(top, 145, 1000));
    const up = [...positions].reverse().map(top => chapterCopyOpacity(top, 145, 1000));
    expect(up).toEqual(down.reverse());
  });
  it('starts fading mobile copy from its own reading position', () => {
    expect(chapterCopyOpacity(440, 440, 1000)).toBe(1);
    expect(chapterCopyOpacity(300, 440, 1000)).toBeCloseTo(0.5);
    expect(chapterCopyOpacity(160, 440, 1000)).toBe(0);
  });
  it('reveals cues near the viewport bottom and eases them away as they rise', () => {
    expect(scrollCueOpacity(990, 1000)).toBeCloseTo(0);
    expect(scrollCueOpacity(840, 1000)).toBe(1);
    expect(scrollCueOpacity(730, 1000)).toBeCloseTo(0.5);
    expect(scrollCueOpacity(650, 1000)).toBe(0);
  });
});
