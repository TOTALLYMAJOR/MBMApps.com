import { describe, expect, it } from 'vitest';
import { buildSocialShareUrls } from '@/lib/social-share';

describe('buildSocialShareUrls', () => {
  it('builds encoded LinkedIn and Facebook share URLs for an article', () => {
    expect(buildSocialShareUrls('https://mbmapps.com/insights/proof & authority')).toEqual({
      linkedin:
        'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fmbmapps.com%2Finsights%2Fproof%20%26%20authority',
      facebook:
        'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmbmapps.com%2Finsights%2Fproof%20%26%20authority'
    });
  });
});
