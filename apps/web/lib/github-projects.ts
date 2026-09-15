export type GitHubProject = {
  name: string;
  url: string;
  homepage: string | null;
  description: string;
  language: string | null;
  topics: string[];
  updatedAt: string;
  previewUrl: string;
};

type GitHubRepository = {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
};

const owner = 'TOTALLYMAJOR';

const fallbackProjects: GitHubProject[] = [
  ['MBMApps.com', 'https://github.com/TOTALLYMAJOR/MBMApps.com', 'https://mbmapps.vercel.app', 'The public home for MBMApps products and operating systems.', 'HTML'],
  ['quoteflow', 'https://github.com/TOTALLYMAJOR/quoteflow', 'https://quoteflow-black.vercel.app', 'A proof-aware quote-to-event operating system.', 'JavaScript'],
  ['LeaguePilotUI', 'https://github.com/TOTALLYMAJOR/LeaguePilotUI', null, 'Private youth-sports coordination and season operations.', 'JavaScript'],
  ['PROOFLOOM', 'https://github.com/TOTALLYMAJOR/PROOFLOOM', null, 'Standalone Design Intelligence package for Codex and Claude.', 'Python'],
  ['AgentFlow', 'https://github.com/TOTALLYMAJOR/AgentFlow', null, 'Governed agent execution from plan through validated integration.', 'TypeScript'],
  ['DecisionIntelligence', 'https://github.com/TOTALLYMAJOR/DecisionIntelligence', null, 'Decision-support systems built around evidence and authority.', 'TypeScript']
].map(([name, url, homepage, description, language]) => ({
  name: name as string,
  url: url as string,
  homepage: homepage as string | null,
  description: description as string,
  language: language as string,
  topics: [],
  updatedAt: '',
  previewUrl: `https://opengraph.githubassets.com/mbmapps/${owner}/${name}`
}));

export async function getGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'MBMApps-site'
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) return fallbackProjects;

    const repositories = (await response.json()) as GitHubRepository[];
    const projects = repositories
      .filter((repository) => !repository.fork && !repository.archived)
      .slice(0, 6)
      .map((repository) => ({
        name: repository.name,
        url: repository.html_url,
        homepage: repository.homepage || null,
        description: repository.description || 'An active MBMApps project from the public GitHub portfolio.',
        language: repository.language,
        topics: repository.topics?.slice(0, 3) ?? [],
        updatedAt: repository.updated_at,
        previewUrl: `https://opengraph.githubassets.com/mbmapps/${owner}/${encodeURIComponent(repository.name)}`
      }));

    return projects.length ? projects : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}
