export type GitHubProject = {
  name: string;
  url: string;
  homepage: string | null;
  description: string;
  language: string | null;
  stars: number;
  topics: string[];
  updatedAt: string;
  previewUrl: string;
};

const utilityRepositoryNames = new Set([
  'PROOFLOOM',
  'AgentFlow',
  'DecisionIntelligence',
  'ai-leverage-library'
]);

export function groupGitHubProjects(repositories: GitHubProject[]) {
  return {
    utilities: repositories.filter((repository) => utilityRepositoryNames.has(repository.name)).slice(0, 4),
    projects: repositories.filter((repository) => !utilityRepositoryNames.has(repository.name)).slice(0, 12)
  };
}

type GitHubRepository = {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
};

const owner = 'TOTALLYMAJOR';

const fallbackProjects: GitHubProject[] = [
  ['MBMApps.com', 'https://github.com/TOTALLYMAJOR/MBMApps.com', 'https://mbmapps.vercel.app', 'The public home for MBMApps products and operating systems.', 'HTML', 1],
  ['quoteflow', 'https://github.com/TOTALLYMAJOR/quoteflow', 'https://quoteflow-black.vercel.app', 'A proof-aware quote-to-event operating system.', 'JavaScript', 1],
  ['wakeforwarriorsshopify', 'https://github.com/TOTALLYMAJOR/wakeforwarriorsshopify', null, 'Public source for the Wake for Warriors Shopify storefront.', 'HTML', 0],
  ['LeaguePilotUI', 'https://github.com/TOTALLYMAJOR/LeaguePilotUI', null, 'Public source for the LeaguePilot interface.', 'JavaScript', 0],
  ['PROOFLOOM', 'https://github.com/TOTALLYMAJOR/PROOFLOOM', null, 'Standalone Design Intelligence package for Codex and Claude.', 'Python', 0],
  ['AgentFlow', 'https://github.com/TOTALLYMAJOR/AgentFlow', null, 'Governed agent execution from plan through validated integration.', 'TypeScript', 0],
  ['DecisionIntelligence', 'https://github.com/TOTALLYMAJOR/DecisionIntelligence', null, 'Decision-support systems built around evidence and authority.', 'TypeScript', 0],
  ['LittleLeaguePlatform', 'https://github.com/TOTALLYMAJOR/LittleLeaguePlatform', 'https://youth-sports-platform-mvp-v3.vercel.app', 'LeaguePilot youth-sports coordination and season operations.', 'TypeScript', 1],
  ['ai-leverage-library', 'https://github.com/TOTALLYMAJOR/ai-leverage-library', null, 'A Git-native field manual of reproducible AI techniques, playbooks, experiments, and evidence.', 'JavaScript', 0],
  ['SC2-Master-Coach', 'https://github.com/TOTALLYMAJOR/SC2-Master-Coach', null, 'A StarCraft II coaching and match-analysis project.', 'JavaScript', 1],
  ['Landing-Page-Copy-Animation', 'https://github.com/TOTALLYMAJOR/Landing-Page-Copy-Animation', null, 'A focused landing-page copy and motion experiment.', 'TypeScript', 0],
  ['jouretnuitconciergeservices', 'https://github.com/TOTALLYMAJOR/jouretnuitconciergeservices', 'https://jouretnuitconciergeservices.vercel.app', 'Public source for Jour et Nuit concierge services.', 'TypeScript', 1],
  ['designconcepts', 'https://github.com/TOTALLYMAJOR/designconcepts', null, 'A repository of product and interface design concepts.', null, 1],
  ['DamageControl', 'https://github.com/TOTALLYMAJOR/DamageControl', null, 'A public application experiment from the MBMApps portfolio.', 'JavaScript', 0],
  ['ChampionSimulatorPearlEdition-', 'https://github.com/TOTALLYMAJOR/ChampionSimulatorPearlEdition-', null, 'A champion simulation project and interactive build.', 'JavaScript', 0],
  ['LolCommandCenter', 'https://github.com/TOTALLYMAJOR/LolCommandCenter', null, 'A command-center interface experiment for League of Legends.', null, 0]
].map(([name, url, homepage, description, language, stars]) => ({
  name: name as string,
  url: url as string,
  homepage: homepage as string | null,
  description: description as string,
  language: language as string,
  stars: stars as number,
  topics: [],
  updatedAt: '',
  previewUrl: `https://opengraph.githubassets.com/mbmapps/${owner}/${name}`
}));

const fallbackProjectByName = new Map(fallbackProjects.map((project) => [project.name, project]));

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
      .slice(0, 16)
      .map((repository) => ({
        name: repository.name,
        url: repository.html_url,
        homepage: repository.homepage || null,
        description:
          repository.description ||
          fallbackProjectByName.get(repository.name)?.description ||
          'An active MBMApps project from the public GitHub portfolio.',
        language: repository.language,
        stars: repository.stargazers_count,
        topics: repository.topics?.slice(0, 3) ?? [],
        updatedAt: repository.updated_at,
        previewUrl: `https://opengraph.githubassets.com/mbmapps/${owner}/${encodeURIComponent(repository.name)}`
      }));

    return projects.length ? projects : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}
