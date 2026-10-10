export type DiscordCommunityConfig =
  | {
      configured: true;
      inviteUrl: string;
      widgetUrl: string;
    }
  | {
      configured: false;
      reason: 'missing' | 'invalid';
    };

type DiscordCommunityInput = {
  serverId?: string;
  inviteUrl?: string;
};

const MBMAPPS_DISCORD_SERVER_ID = '1558575907621568593';
const MBMAPPS_DISCORD_INVITE_URL = 'https://discord.gg/4DdamZUuW';

function isDiscordInviteUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;

    const hostname = url.hostname.toLowerCase();
    const pathSegments = url.pathname.split('/').filter(Boolean);

    if (hostname === 'discord.gg') return pathSegments.length === 1;
    if (hostname === 'discord.com' || hostname === 'www.discord.com') {
      return pathSegments.length === 2 && pathSegments[0] === 'invite';
    }

    return false;
  } catch {
    return false;
  }
}

export function resolveDiscordCommunityConfig({
  serverId = process.env.DISCORD_SERVER_ID ?? MBMAPPS_DISCORD_SERVER_ID,
  inviteUrl = process.env.DISCORD_INVITE_URL ?? MBMAPPS_DISCORD_INVITE_URL
}: DiscordCommunityInput = {}): DiscordCommunityConfig {
  const normalizedServerId = (serverId ?? '').trim();
  const normalizedInviteUrl = (inviteUrl ?? '').trim();

  if (!normalizedServerId || !normalizedInviteUrl) {
    return { configured: false, reason: 'missing' };
  }

  if (!/^\d{15,22}$/.test(normalizedServerId) || !isDiscordInviteUrl(normalizedInviteUrl)) {
    return { configured: false, reason: 'invalid' };
  }

  return {
    configured: true,
    inviteUrl: normalizedInviteUrl,
    widgetUrl: `https://discord.com/widget?id=${normalizedServerId}&theme=dark`
  };
}
