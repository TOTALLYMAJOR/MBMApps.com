import { describe, expect, it } from 'vitest';
import { resolveDiscordCommunityConfig } from './discord-community';

describe('resolveDiscordCommunityConfig', () => {
  it('builds a safe Discord widget configuration from valid inputs', () => {
    expect(resolveDiscordCommunityConfig({
      serverId: '123456789012345678',
      inviteUrl: 'https://discord.gg/mbmapps'
    })).toEqual({
      configured: true,
      inviteUrl: 'https://discord.gg/mbmapps',
      widgetUrl: 'https://discord.com/widget?id=123456789012345678&theme=dark'
    });
  });

  it('rejects missing configuration', () => {
    expect(resolveDiscordCommunityConfig({ serverId: '', inviteUrl: '' })).toEqual({
      configured: false,
      reason: 'missing'
    });
  });

  it('rejects a non-numeric server id', () => {
    expect(resolveDiscordCommunityConfig({
      serverId: 'not-a-server',
      inviteUrl: 'https://discord.gg/mbmapps'
    })).toEqual({
      configured: false,
      reason: 'invalid'
    });
  });

  it.each([
    'http://discord.gg/mbmapps',
    'https://example.com/mbmapps',
    'https://discord.com/channels/123/456'
  ])('rejects an unsafe or non-invite URL: %s', (inviteUrl) => {
    expect(resolveDiscordCommunityConfig({
      serverId: '123456789012345678',
      inviteUrl
    })).toEqual({
      configured: false,
      reason: 'invalid'
    });
  });
});
