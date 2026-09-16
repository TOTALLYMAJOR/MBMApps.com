export function buildSocialShareUrls(articleUrl: string) {
  const encodedUrl = encodeURIComponent(articleUrl);

  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  };
}
