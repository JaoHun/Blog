const isGithubPages = process.env.DEPLOY_TARGET === 'github-pages';
const repoName = process.env.GITHUB_PAGES_REPO || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: isGithubPages && repoName ? `/${repoName}` : '',
  assetPrefix: isGithubPages && repoName ? `/${repoName}/` : '',
};

module.exports = nextConfig;
