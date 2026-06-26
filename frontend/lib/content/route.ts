export function joinSiteUrl(siteUrl: string, pathname: string) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `${normalizedSiteUrl}${normalizedPath}`;
}

export function routeSegment(value: string) {
  return encodeURIComponent(value.trim());
}
