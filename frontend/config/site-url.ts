export const defaultSiteUrl = 'https://blog-nu-wine-76.vercel.app';

export function resolveSiteUrl(env: NodeJS.ProcessEnv | { SITE_URL?: string } = process.env) {
  const siteUrl = env.SITE_URL?.trim();

  return siteUrl || defaultSiteUrl;
}
