import { describe, expect, it } from 'vitest';
import * as githubProjectModule from '@/lib/github-projects';
import type { GitHubProject } from '@/lib/github-projects';

function repository(name: string): GitHubProject {
  return {
    name,
    url: `https://github.com/TOTALLYMAJOR/${name}`,
    homepage: null,
    description: `${name} repository description`,
    language: 'TypeScript',
    stars: 0,
    topics: [],
    updatedAt: '2026-09-16T00:00:00Z',
    previewUrl: `https://opengraph.githubassets.com/mbmapps/TOTALLYMAJOR/${name}`
  };
}

describe('GitHub portfolio grouping', () => {
  it('exposes a portfolio grouping function', () => {
    expect(typeof (githubProjectModule as Record<string, unknown>).groupGitHubProjects).toBe('function');
  });

  it('separates four utility repositories from twelve recent projects without duplication', () => {
    const names = [
      'MBMApps.com',
      'quoteflow',
      'PROOFLOOM',
      'wakeforwarriorsshopify',
      'AgentFlow',
      'LeaguePilotUI',
      'DecisionIntelligence',
      'LittleLeaguePlatform',
      'ai-leverage-library',
      'SC2-Master-Coach',
      'Landing-Page-Copy-Animation',
      'jouretnuitconciergeservices',
      'designconcepts',
      'DamageControl',
      'ChampionSimulatorPearlEdition-',
      'LolCommandCenter',
      'Web_Components'
    ];

    const portfolio = githubProjectModule.groupGitHubProjects(names.map(repository));

    expect(portfolio.utilities.map((item) => item.name)).toEqual([
      'PROOFLOOM',
      'AgentFlow',
      'DecisionIntelligence',
      'ai-leverage-library'
    ]);
    expect(portfolio.projects).toHaveLength(12);
    expect(portfolio.projects.map((item) => item.name)).toEqual([
      'MBMApps.com',
      'quoteflow',
      'wakeforwarriorsshopify',
      'LeaguePilotUI',
      'LittleLeaguePlatform',
      'SC2-Master-Coach',
      'Landing-Page-Copy-Animation',
      'jouretnuitconciergeservices',
      'designconcepts',
      'DamageControl',
      'ChampionSimulatorPearlEdition-',
      'LolCommandCenter'
    ]);
  });
});
