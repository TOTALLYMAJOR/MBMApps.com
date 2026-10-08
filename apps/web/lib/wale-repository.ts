export function normalizeGithubRepository(value: string): { ok: true; value: string } | { ok: false; error: string } {
  const candidate = value.trim();
  if (!candidate) return { ok: false, error: 'Enter your GitHub repository URL.' };
  try {
    const absolute = candidate.startsWith('github.com/') ? `https://${candidate}` : candidate;
    // Reject extra/path-normalizing segments before URL parsing can erase them.
    if (!/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/i.test(absolute)) {
      return { ok: false, error: 'Use https://github.com/owner/repository, without credentials, query parameters, or a file path.' };
    }
    const url = new URL(absolute);
    const segments = url.pathname.replace(/\/$/, '').replace(/\.git$/, '').split('/').filter(Boolean);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password || url.search || url.hash || segments.length !== 2 || segments.some(part => !/^[a-zA-Z0-9_.-]+$/.test(part) || part === '.' || part === '..')) {
      return { ok: false, error: 'Use https://github.com/owner/repository, without credentials, query parameters, or a file path.' };
    }
    return { ok: true, value: `https://github.com/${segments.join('/')}` };
  } catch {
    return { ok: false, error: 'Use a GitHub repository URL, such as https://github.com/owner/repository.' };
  }
}
