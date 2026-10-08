import { describe, expect, it } from 'vitest';
import { normalizeGithubRepository } from './wale-repository';

describe('Wale public repository URL review', () => {
  it('normalizes a repository without implying access or transferring credentials', () => {
    expect(normalizeGithubRepository(' github.com/wale/system.git/ ')).toEqual({ ok: true, value: 'https://github.com/wale/system' });
  });
  it.each(['', 'https://github.com/owner', 'https://github.com/owner/repo/tree/main', 'https://evil.example/owner/repo', 'http://github.com/owner/repo', 'https://token@github.com/owner/repo', 'https://github.com/owner/repo?token=secret', 'https://github.com:8443/owner/repo', 'https://github.com/a/b/../c', 'https://github.com/a/b/%2e%2e/c', 'https://github.com/a//b'])('rejects unsafe or ambiguous input %s', value => {
    expect(normalizeGithubRepository(value).ok).toBe(false);
  });
});
